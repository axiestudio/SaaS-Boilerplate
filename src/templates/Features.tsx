import { useTranslations } from 'next-intl';
import { MessageCircle, Palette, Zap, BarChart3, Globe, Shield } from 'lucide-react';

import { Background } from '@/components/Background';
import { FeatureCard } from '@/features/landing/FeatureCard';
import { Section } from '@/features/landing/Section';

export const Features = () => {
  const t = useTranslations('Features');

  return (
    <Background>
      <Section
        subtitle="Platform Features"
        title="Everything You Need for Professional Chat Experiences"
        description="Build, customize, and deploy AI-powered chat interfaces that represent your brand and connect to your Axie Studio flows."
      >
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Palette className="h-6 w-6" />}
            title="Custom Branding"
          >
            Complete control over your chat interface appearance. Customize colors, logos, messages, and styling to match your brand identity perfectly.
          </FeatureCard>

          <FeatureCard
            icon={<MessageCircle className="h-6 w-6" />}
            title="Real-time Conversations"
          >
            Instant messaging with your customers powered by Axie Studio AI flows. Provide immediate support and engagement 24/7.
          </FeatureCard>

          <FeatureCard
            icon={<Zap className="h-6 w-6" />}
            title="Axie Studio Integration"
          >
            Seamlessly connect to your existing Axie Studio AI flows. No complex setup required - just enter your API endpoint and you're ready.
          </FeatureCard>

          <FeatureCard
            icon={<Globe className="h-6 w-6" />}
            title="Instant Deployment"
          >
            Get a unique public URL for each chat interface. Share with customers immediately or embed on your website with zero configuration.
          </FeatureCard>

          <FeatureCard
            icon={<BarChart3 className="h-6 w-6" />}
            title="Analytics & Insights"
          >
            Monitor conversation metrics, track customer engagement, and analyze chat performance with built-in analytics dashboard.
          </FeatureCard>

          <FeatureCard
            icon={<Shield className="h-6 w-6" />}
            title="Enterprise Security"
          >
            Bank-level security with encrypted conversations, secure API connections, and compliance-ready data handling for enterprise use.
          </FeatureCard>
        </div>
      </Section>
    </Background>
  );
};