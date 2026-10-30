import { Metadata } from 'next';
import Link from 'next/link';
import {
  CONTACT_EMAIL,
  PublicSection,
} from '@gitroom/frontend/components/public/public.page';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Terms of Service - Postiz by Bram de Smidt Media',
  description: 'Terms of Service for the Postiz instance of Bram de Smidt Media.',
};

export default async function Terms() {
  return (
    <>
      <div className="flex flex-col gap-[8px] py-[24px]">
        <h1 className="text-[40px] font-[800]">Terms of Service</h1>
        <p className="text-white/60">Last updated: October 30, 2026</p>
      </div>

      <PublicSection title="1. About this service">
        <p>
          This website is a private, self-hosted instance of the open-source
          tool Postiz, operated by Bram de Smidt Media, the Netherlands (&quot;I&quot;,
          &quot;me&quot;). It is a social media scheduling tool that I use to plan and
          publish my own content, including to my own TikTok account.
        </p>
      </PublicSection>

      <PublicSection title="2. Acceptance of these terms">
        <p>
          By logging in to or using this service you agree to these Terms of
          Service. If you do not agree, do not use the service.
        </p>
      </PublicSection>

      <PublicSection title="3. Who may use the service">
        <p>
          The service is intended for personal use by its operator and by
          people I have explicitly given an account. It is not offered to the
          general public. You must be at least 18 years old to use it, and you
          must keep your login credentials confidential.
        </p>
      </PublicSection>

      <PublicSection title="4. Your content and third-party platforms">
        <p>
          You remain the owner of the content you upload. You are responsible
          for that content and for having the rights to publish it. When you
          connect a TikTok account, you also remain bound by TikTok&apos;s Terms of
          Service and Community Guidelines. The service only transmits the
          content you choose to TikTok, at the time and with the settings you
          choose.
        </p>
      </PublicSection>

      <PublicSection title="5. Acceptable use">
        <p>You agree not to use the service to:</p>
        <ul className="list-disc ps-[24px] flex flex-col gap-[4px]">
          <li>publish unlawful, infringing, harmful or misleading content;</li>
          <li>send spam or automate abusive activity;</li>
          <li>
            attempt to access accounts or data that are not yours, or to
            disrupt or overload the service;
          </li>
          <li>violate the terms of any connected platform.</li>
        </ul>
      </PublicSection>

      <PublicSection title="6. Third-party services">
        <p>
          The service depends on third-party platforms such as TikTok. I do not
          control these platforms and am not responsible for their availability,
          changes, or decisions, for example removing a post or restricting an
          account.
        </p>
      </PublicSection>

      <PublicSection title="7. Availability and no warranty">
        <p>
          The service is provided &quot;as is&quot; and &quot;as available&quot;, without
          warranties of any kind. I do not guarantee that it will be
          uninterrupted or error-free, or that scheduled posts will always be
          published at the requested time.
        </p>
      </PublicSection>

      <PublicSection title="8. Limitation of liability">
        <p>
          To the extent permitted by law, I am not liable for any indirect or
          consequential damage, or for loss of data, content, revenue or
          reach, arising from the use of the service. Nothing in these terms
          limits liability that cannot be limited under Dutch law.
        </p>
      </PublicSection>

      <PublicSection title="9. Termination and revoking access">
        <p>
          You may stop using the service at any time and can revoke access to
          your TikTok account in TikTok under Settings and privacy, Security
          and permissions, Manage app permissions. I may suspend or remove
          accounts that violate these terms. How data is handled is described
          in the{' '}
          <Link href="/privacy" className="underline">
            Privacy Policy
          </Link>
          .
        </p>
      </PublicSection>

      <PublicSection title="10. Changes">
        <p>
          I may update these terms from time to time. The date at the top shows
          when they were last changed. Continued use of the service after a
          change means you accept the updated terms.
        </p>
      </PublicSection>

      <PublicSection title="11. Governing law">
        <p>
          These terms are governed by the laws of the Netherlands. Disputes
          will be brought before the competent court in the Netherlands.
        </p>
      </PublicSection>

      <PublicSection title="12. Contact">
        <p>
          Questions about these terms:{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
            {CONTACT_EMAIL}
          </a>
        </p>
      </PublicSection>
    </>
  );
}
