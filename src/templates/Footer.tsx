import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { CenteredFooter } from '@/features/landing/CenteredFooter';
import { Section } from '@/features/landing/Section';
import { AppConfig } from '@/utils/AppConfig';

import { Logo } from './Logo';

export const Footer = () => {
  const t = useTranslations('Footer');

  return (
    <Section className="pb-16 pt-0">
      <CenteredFooter
        logo={<Logo />}
        name={AppConfig.name}
        iconList={
          /* 🎯 REMOVED SOCIAL ICONS - CLEAN FOOTER */
          <></>
        }
        legalLinks={(
          <>
            <li>
              <Link href="https://axiestudio.se" target="_blank" className="hover:text-primary">Terms of Service</Link>
            </li>
            <li>
              <Link href="https://axiestudio.se" target="_blank" className="hover:text-primary">Privacy Policy</Link>
            </li>
            <li>
              <Link href="https://axiestudio.se" target="_blank" className="hover:text-primary">Contact</Link>
            </li>
          </>
        )}
      >
        <></>







      </CenteredFooter>
    </Section>
  );
};