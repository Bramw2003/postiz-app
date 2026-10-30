import { Metadata } from 'next';
import {
  CONTACT_EMAIL,
  PublicSection,
} from '@gitroom/frontend/components/public/public.page';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Privacy Policy - Postiz by Bram de Smidt Media',
  description: 'Privacy Policy for the Postiz instance of Bram de Smidt Media.',
};

export default async function Privacy() {
  return (
    <>
      <div className="flex flex-col gap-[8px] py-[24px]">
        <h1 className="text-[40px] font-[800]">Privacy Policy</h1>
        <p className="text-white/60">Last updated: October 30, 2026</p>
      </div>

      <PublicSection title="1. Who is responsible">
        <p>
          This Privacy Policy applies to the private Postiz instance operated
          by Bram de Smidt Media, the Netherlands. I am the data controller.
          Contact:{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </PublicSection>

      <PublicSection title="2. Data I access from TikTok">
        <p>
          When you connect a TikTok account through TikTok Login Kit, the app
          requests the <strong>user.info.basic</strong> scope and reads:
        </p>
        <ul className="list-disc ps-[24px] flex flex-col gap-[4px]">
          <li>your TikTok open_id (a unique identifier for your account);</li>
          <li>your display name;</li>
          <li>your profile picture (avatar URL).</li>
        </ul>
        <p>
          This is used only to show which TikTok account is connected. Through
          the Content Posting API (<strong>video.upload</strong> and{' '}
          <strong>video.publish</strong>) the app also sends the videos and
          captions that you upload and choose to post, and receives the
          publishing status from TikTok.
        </p>
      </PublicSection>

      <PublicSection title="3. Other data">
        <p>
          To run the service I also store your login details (email address and
          a hashed password), the access and refresh tokens TikTok issues for
          your connected account, the posts you schedule (captions, settings,
          timing, status) and the media files you upload. A strictly necessary
          cookie keeps you logged in. Standard server logs (such as IP address
          and request time) are kept for security and troubleshooting.
        </p>
      </PublicSection>

      <PublicSection title="4. Why I use this data">
        <p>
          I use the data only to provide the service: authenticating you,
          connecting your TikTok account and uploading or publishing the
          content you choose. The legal basis is your consent (given on
          TikTok&apos;s authorization screen) and, for logs and security, my
          legitimate interest in keeping the service secure (GDPR Art. 6(1)(a)
          and (f)).
        </p>
      </PublicSection>

      <PublicSection title="5. How it is stored and protected">
        <p>
          Data is stored in the database and media storage of this
          self-hosted instance, which I manage on infrastructure of my hosting
          providers. Access is limited to me, and the service is only served
          over HTTPS. TikTok access tokens are used only to make the requests
          you initiate and are never shown to other users.
        </p>
      </PublicSection>

      <PublicSection title="6. No selling or sharing">
        <p>
          I do not sell your data and I do not share it with third parties for
          advertising or any other purpose. The only recipient of your content
          and TikTok data is TikTok itself, at your direction, and my hosting
          providers who process data on my behalf to run the service.
        </p>
      </PublicSection>

      <PublicSection title="7. Retention">
        <p>
          TikTok tokens and profile data are removed when you disconnect the
          account in the app or revoke access on TikTok. Uploaded media and
          post history are kept until I delete them or you ask me to. Server
          logs are kept for a limited period.
        </p>
      </PublicSection>

      <PublicSection title="8. Revoking access">
        <p>
          You can revoke this app&apos;s access to your TikTok account at any time
          in TikTok: Settings and privacy, Security and permissions, Manage app
          permissions, then remove this app. Without a valid token the app can
          no longer access your account.
        </p>
      </PublicSection>

      <PublicSection title="9. Your rights (GDPR) and deletion requests">
        <p>
          As I operate in the Netherlands, the EU General Data Protection
          Regulation (GDPR) applies. You have the right to access, correct,
          erase, restrict or export your data, and to object to its processing.
          To request access or deletion of all data I hold about you, including
          TikTok tokens, profile data and uploaded media, email{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
            {CONTACT_EMAIL}
          </a>
          . I will respond within one month. You also have the right to lodge a
          complaint with the Dutch Data Protection Authority (Autoriteit
          Persoonsgegevens).
        </p>
      </PublicSection>

      <PublicSection title="10. Children">
        <p>The service is not intended for anyone under 18.</p>
      </PublicSection>

      <PublicSection title="11. Changes">
        <p>
          I may update this policy. The date at the top shows when it was last
          changed.
        </p>
      </PublicSection>
    </>
  );
}
