import { FC, ReactNode } from 'react';
import Link from 'next/link';

export const CONTACT_EMAIL = 'bram@bramdesmidt.nl';

export const LegalLinks: FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`flex gap-[16px] text-[14px] ${className || ''}`}>
      <Link href="/terms" className="underline hover:text-white">
        Terms of Service
      </Link>
      <Link href="/privacy" className="underline hover:text-white">
        Privacy Policy
      </Link>
    </div>
  );
};

export const PublicSection: FC<{ title: string; children: ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <section className="flex flex-col gap-[12px] bg-[#1A1919] rounded-[12px] p-[24px]">
      <h2 className="text-[24px] font-[600]">{title}</h2>
      <div className="flex flex-col gap-[12px] text-[16px] leading-[26px] text-white/80">
        {children}
      </div>
    </section>
  );
};
