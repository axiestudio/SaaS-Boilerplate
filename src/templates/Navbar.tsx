import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { CenteredMenu } from '@/features/landing/CenteredMenu';
import { Section } from '@/features/landing/Section';

import { Logo } from './Logo';

export const Navbar = () => {
  const t = useTranslations('Navbar');

  return (
    <Section className="px-3 py-6">
      <CenteredMenu
        logo={<Logo />}
        rightMenu={(
          <>
            <li data-fade>
              <LocaleSwitcher />
            </li>
            <li className="ml-1 mr-2.5" data-fade>
              <Link href="/sign-in" className="text-sm font-medium hover:text-primary">
                Sign In
              </Link>
            </li>
            <li>
              <Link className={buttonVariants({ size: 'sm' })} href="/sign-up">
                Get Started
              </Link>
            </li>
          </>
        )}
      >
        <li>
          <Link href="#features" className="text-sm font-medium hover:text-primary">
            Features
          </Link>
        </li>

        <li>
          <Link href="#pricing" className="text-sm font-medium hover:text-primary">
            Pricing
          </Link>
        </li>

        <li>
          <Link href="/chat/demo" className="text-sm font-medium hover:text-primary">
            Demo
          </Link>
        </li>

        <li>
          <Link href="https://axiestudio.se" target="_blank" className="text-sm font-medium hover:text-primary">
            Axie Studio
          </Link>
        </li>
      </CenteredMenu>
    </Section>
  );
};