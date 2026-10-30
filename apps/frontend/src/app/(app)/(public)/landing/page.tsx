import { Metadata } from 'next';
import Link from 'next/link';
import {
  CONTACT_EMAIL,
  PublicSection,
} from '@gitroom/frontend/components/public/public.page';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Postiz by Bram de Smidt Media - Social media scheduling',
  description:
    'A personal, self-hosted social media scheduling tool by Bram de Smidt Media that connects to my own TikTok account to upload and publish my own videos.',
};

export default async function Landing() {
  return (
    <>
      <div className="flex flex-col gap-[16px] py-[32px] text-center">
        <h1 className="text-[40px] lg:text-[56px] leading-[1.1] font-[800]">
          Postiz by Bram de Smidt Media
        </h1>
        <p className="text-[18px] leading-[28px] text-white/80 max-w-[640px] mx-auto">
          A personal, self-hosted social media scheduling tool. It lets me
          connect my own TikTok account and upload or post my own videos from
          one place.
        </p>
      </div>

      <PublicSection title="What is this app?">
        <p>
          This is a private instance of the open-source scheduling tool Postiz,
          run by Bram de Smidt Media in the Netherlands. It is used to plan
          and publish my own content to my own social media accounts. It is not
          a public service and it does not publish anything on behalf of
          other people.
        </p>
      </PublicSection>

      <PublicSection title="How the TikTok integration works">
        <ol className="list-decimal ps-[24px] flex flex-col gap-[8px]">
          <li>
            <strong>Log in with TikTok (Login Kit).</strong> I connect my own
            TikTok account and approve the permissions on TikTok&apos;s own
            authorization screen.
          </li>
          <li>
            <strong>Upload a video.</strong> I choose a video file I own,
            write the caption and pick when it should go out.
          </li>
          <li>
            <strong>Save as a draft or post directly (Content Posting API).</strong>{' '}
            Either the video is sent to my TikTok inbox as a draft, which I
            finish and publish in the TikTok app, or it is published directly
            to my account with the privacy setting I selected.
          </li>
        </ol>
      </PublicSection>

      <PublicSection title="What data is used">
        <p>
          The app only reads basic profile information (TikTok user ID, display
          name and profile picture) to show which account is connected. The
          videos and captions I upload are sent to TikTok only to be saved as a
          draft or published. Nothing is sold or shared with third parties.
          Details are in the{' '}
          <Link href="/privacy" className="underline">
            Privacy Policy
          </Link>
          .
        </p>
      </PublicSection>

      <PublicSection title="Contact">
        <p>
          Questions, or want your data removed? Email{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </PublicSection>
    </>
  );
}
