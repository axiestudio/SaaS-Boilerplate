import { ArrowRight } from 'lucide-react';

import { buttonVariants } from '@/components/ui/buttonVariants';
import { Section } from '@/features/landing/Section';

export const CTA = () => {
  return (
    <Section className="py-24">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight mb-4">
          Ready to Transform Your Customer Support?
        </h2>
        <p className="text-xl text-muted-foreground mb-8">
          Join thousands of businesses using Axie Studio Chat Builder to deliver exceptional customer experiences. Start your free trial today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            className={buttonVariants({ size: 'lg', className: 'px-8' })}
            href="/sign-up"
          >
            Start Free Trial
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
          <a
            className={buttonVariants({ variant: 'outline', size: 'lg', className: 'px-8' })}
            href="/chat/demo"
          >
            View Live Demo
          </a>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          No credit card required • Setup in under 5 minutes • Cancel anytime
        </p>
      </div>
    </Section>
  );
};