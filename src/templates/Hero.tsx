import { useTranslations } from 'next-intl';

import { buttonVariants } from '@/components/ui/buttonVariants';
import { CenteredHero } from '@/features/landing/CenteredHero';
import { Section } from '@/features/landing/Section';

export const Hero = () => {
  const t = useTranslations('Hero');

  return (
    <Section className="py-24">
      <CenteredHero
        banner={
          <div className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-sm font-medium">
            <span className="mr-2 h-2 w-2 rounded-full bg-green-500"></span>
            Trusted by businesses worldwide
          </div>
        }
        title={
          <span>
            Build Professional{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Chat Interfaces
            </span>{' '}
            for Your Business
          </span>
        }
        description="Create custom-branded chat experiences that connect seamlessly to your Axie Studio AI flows. Deploy instantly, customize completely, and engage customers with intelligent conversations."
        buttons={(
          <>
            <a
              className={buttonVariants({ size: 'lg', className: 'px-8' })}
              href="/sign-up"
            >
              Start Building Free
            </a>

            <a
              className={buttonVariants({ variant: 'outline', size: 'lg', className: 'px-8' })}
              href="/chat/demo"
            >
              View Live Demo
            </a>
          </>
        )}
      />
    </Section>
  );
};