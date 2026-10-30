import {
  AuthTokenDetails,
  PostDetails,
  PostResponse,
  SocialProvider,
} from '@gitroom/nestjs-libraries/integrations/social/social.integrations.interface';
import { SocialAbstract } from '@gitroom/nestjs-libraries/integrations/social.abstract';
import dayjs from 'dayjs';
import { createHash, createHmac } from 'crypto';
import { makeSecureId } from '@gitroom/nestjs-libraries/services/make.secure.id';
import { WebsiteDto } from '@gitroom/nestjs-libraries/dtos/posts/providers-settings/website.dto';
import { Rules } from '@gitroom/nestjs-libraries/chat/rules.description.decorator';
import { getSsrfSafeDispatcher } from '@gitroom/nestjs-libraries/dtos/webhooks/ssrf.safe.dispatcher';
import { AuthService } from '@gitroom/helpers/auth/auth.service';
import { Integration } from '@prisma/client';

/**
 * Publishes a post to any website that exposes a publish endpoint.
 *
 * POST <endpoint> with JSON:
 *   { event: 'post.published', postId, title, summary?, content (HTML),
 *     translation?: { title?, summary? }, media: [{ type, url, alt? }], publishedAt }
 * and expects a 2xx JSON response, optionally { id, url } - url becomes the post's link in Postiz.
 * The same postId is sent again when Postiz retries, so the endpoint should be idempotent on it.
 *
 * Authentication, per channel:
 *   bearer - Authorization: Bearer <secret>
 *   hmac   - X-Postiz-Timestamp: <unix seconds>
 *            X-Postiz-Signature: sha256=<hex HMAC-SHA256(secret, `${timestamp}.${body}`)>
 *            (the secret never leaves Postiz; the site should reject old timestamps)
 *
 * Connecting the channel first POSTs { event: 'connection.test' } the same way; the endpoint must
 * answer 2xx without publishing anything, and may return { name, picture } for the channel.
 */
type AuthMode = 'bearer' | 'hmac';

type WebsiteCredentials = {
  name: string;
  endpoint: string;
  secret: string;
  auth: AuthMode;
};

function readCredentials(json: string): WebsiteCredentials {
  const body = JSON.parse(json);
  return {
    name: String(body.name || '').trim(),
    endpoint: String(body.endpoint || '').trim(),
    secret: String(body.secret || '').trim(),
    auth: String(body.auth || 'bearer').trim().toLowerCase() === 'hmac' ? 'hmac' : 'bearer',
  };
}

function authHeaders(credentials: WebsiteCredentials, body: string): Record<string, string> {
  if (credentials.auth === 'bearer') {
    return { Authorization: `Bearer ${credentials.secret}` };
  }
  const timestamp = String(dayjs().unix());
  const signature = createHmac('sha256', credentials.secret)
    .update(`${timestamp}.${body}`)
    .digest('hex');
  return {
    'X-Postiz-Timestamp': timestamp,
    'X-Postiz-Signature': `sha256=${signature}`,
  };
}

const URL_VALIDATION = `/^https:\\/\\/(?:www\\.)?[\\w\\-]+(\\.[\\w\\-]+)+([\\/?#][^\\s]*)?$/`;

@Rules(
  'Website publishes the content as an article on a website: the title setting is required, pictures are sent along as media and it is up to the website whether it shows them'
)
export class WebsiteProvider extends SocialAbstract implements SocialProvider {
  identifier = 'website';
  name = 'Website';
  toolTip = 'Publish articles to your own website through an HTTPS endpoint';
  isBetweenSteps = false;
  editor = 'html' as const;
  scopes = [] as string[];
  override maxConcurrentJob = 4; // the user's own servers
  dto = WebsiteDto;

  maxLength() {
    return 100000;
  }

  async generateAuthUrl() {
    const state = makeSecureId(6);
    return {
      url: state,
      codeVerifier: makeSecureId(10),
      state,
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthTokenDetails> {
    return {
      refreshToken: '',
      expiresIn: 0,
      accessToken: '',
      id: '',
      name: '',
      picture: '',
      username: '',
    };
  }

  override handleErrors(body: string, status: number) {
    if (status === 401 || status === 403) {
      return {
        type: 'bad-body' as const,
        value: 'The website rejected the secret, reconnect the channel with the current secret',
      };
    }
    if (status === 400 || status === 422) {
      let message = body;
      try {
        message = JSON.parse(body).error || body;
      } catch (err) {
        // not JSON
      }
      return { type: 'bad-body' as const, value: message };
    }
    return undefined;
  }

  async customFields() {
    return [
      {
        key: 'name',
        label: 'Channel name',
        validation: `/.+/`,
        type: 'text' as const,
        hint: 'How this website is shown in Postiz',
      },
      {
        key: 'endpoint',
        label: 'Publish endpoint',
        validation: URL_VALIDATION,
        type: 'text' as const,
        hint: 'Full HTTPS URL that receives the article, e.g. https://example.com/api/postiz',
      },
      {
        key: 'secret',
        label: 'Secret',
        validation: `/^.{8,}$/`,
        type: 'password' as const,
      },
      {
        key: 'auth',
        label: 'Authentication',
        defaultValue: 'bearer',
        validation: `/^(bearer|hmac)$/i`,
        type: 'text' as const,
        hint: '"bearer" sends the secret as a Bearer token, "hmac" signs each request with it',
      },
    ];
  }

  async authenticate(params: {
    code: string;
    codeVerifier: string;
    refresh?: string;
  }) {
    const credentials = readCredentials(
      Buffer.from(params.code, 'base64').toString()
    );
    if (!/^https:\/\//i.test(credentials.endpoint)) {
      return 'The publish endpoint must be an HTTPS URL.';
    }
    const body = JSON.stringify({ event: 'connection.test' });

    // Plain fetch (not `this.fetch`): authenticate runs outside a Temporal activity.
    let response: Response;
    try {
      response = await fetch(credentials.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders(credentials, body),
        },
        body,
        // @ts-ignore - undici-only option; blocks SSRF to internal IPs
        dispatcher: getSsrfSafeDispatcher(),
      });
    } catch (err) {
      console.log(err);
      return 'Could not reach the publish endpoint. Check the URL and that the website is publicly accessible.';
    }

    if (response.status === 401 || response.status === 403) {
      return 'The website rejected the secret.';
    }
    if (!response.ok) {
      return `The publish endpoint returned an unexpected error (HTTP ${response.status}).`;
    }

    let picture = '';
    try {
      picture = (await response.json())?.picture || '';
    } catch (err) {
      // A plain 2xx is a valid answer too.
    }

    const host = new URL(credentials.endpoint).host;
    const id = createHash('sha256')
      .update(credentials.endpoint)
      .digest('hex')
      .slice(0, 24);
    return {
      refreshToken: '',
      expiresIn: dayjs().add(100, 'years').unix() - dayjs().unix(),
      // The secret only lives in the encrypted customInstanceDetails, see post()
      accessToken: id,
      // One channel per endpoint
      id,
      name: credentials.name || host,
      picture,
      username: host,
    };
  }

  async post(
    id: string,
    accessToken: string,
    postDetails: PostDetails<WebsiteDto>[],
    integration: Integration
  ): Promise<PostResponse[]> {
    const credentials = readCredentials(
      AuthService.fixedDecryption(integration.customInstanceDetails!)
    );
    const [first] = postDetails;
    const settings = first.settings || ({} as WebsiteDto);

    const translation = {
      ...(settings.translated_title ? { title: settings.translated_title } : {}),
      ...(settings.translated_summary ? { summary: settings.translated_summary } : {}),
    };

    const body = JSON.stringify({
      event: 'post.published',
      postId: first.id,
      title: settings.title,
      ...(settings.summary ? { summary: settings.summary } : {}),
      content: first.message,
      ...(Object.keys(translation).length ? { translation } : {}),
      media: (first.media || []).map((m) => ({
        type: m.type,
        url: m.path,
        ...(m.alt ? { alt: m.alt } : {}),
      })),
      publishedAt: new Date().toISOString(),
    });

    const response = await this.fetch(credentials.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(credentials, body),
      },
      body,
    });

    let result: { id?: string | number; url?: string } = {};
    try {
      result = await response.json();
    } catch (err) {
      // A 2xx without a JSON body still means it was published.
    }

    return [
      {
        id: first.id,
        status: 'completed',
        postId: String(result.id ?? first.id),
        releaseURL: result.url || new URL(credentials.endpoint).origin,
      },
    ];
  }
}
