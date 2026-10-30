import { ReactNode } from 'react';
import Link from 'next/link';
import { LogoTextComponent } from '@gitroom/frontend/components/ui/logo-text.component';
import {
  CONTACT_EMAIL,
  LegalLinks,
} from '@gitroom/frontend/components/public/public.page';

export const dynamic = 'force-dynamic';

export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="bg-[#0E0E0E] min-h-screen text-white flex flex-col">
      <header className="flex items-center justify-between px-[20px] lg:px-[40px] py-[20px]">
        <Link href="/" aria-label="Home">
          <LogoTextComponent />
        </Link>
        <Link
          href="/auth/login"
          className="bg-[#612BD3] hover:bg-[#7a49e0] rounded-[8px] px-[20px] py-[10px] text-[14px] font-[500]"
        >
          Log in
        </Link>
      </header>
      <main className="flex-1 w-full max-w-[860px] mx-auto px-[20px] py-[24px] flex flex-col gap-[20px]">
        {children}
      </main>
      <footer className="px-[20px] lg:px-[40px] py-[32px] mt-[24px] border-t border-white/10 flex flex-col items-center gap-[12px] text-white/70">
        <LegalLinks />
        <div className="text-[14px]">
          Contact:{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
            {CONTACT_EMAIL}
          </a>
        </div>
        <div className="text-[13px] text-white/50">
          &copy; {new Date().getFullYear()} Bram de Smidt Media
        </div>
      </footer>
    </div>
  );
}
