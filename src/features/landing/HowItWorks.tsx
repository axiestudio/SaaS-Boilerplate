import { ArrowRight, Settings, Palette, Globe } from 'lucide-react';

import { Section } from '@/features/landing/Section';

export const HowItWorks = () => {
  return (
    <Section
      subtitle="How It Works"
      title="From Setup to Success in Minutes"
      description="Get your professional chat interface up and running with our simple three-step process."
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="relative">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full">
            <Settings className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-3">1. Connect Your API</h3>
            <p className="text-muted-foreground">
              Enter your Axie Studio flow endpoint and API key. Test the connection to ensure everything works perfectly.
            </p>
          </div>
          <div className="hidden md:block absolute top-8 -right-4 text-muted-foreground">
            <ArrowRight className="w-6 h-6" />
          </div>
        </div>

        <div className="relative">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-purple-100 rounded-full">
            <Palette className="w-8 h-8 text-purple-600" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-3">2. Customize Your Brand</h3>
            <p className="text-muted-foreground">
              Upload your logo, set brand colors, customize messages, and preview your chat interface in real-time.
            </p>
          </div>
          <div className="hidden md:block absolute top-8 -right-4 text-muted-foreground">
            <ArrowRight className="w-6 h-6" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full">
            <Globe className="w-8 h-8 text-green-600" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-3">3. Deploy & Share</h3>
            <p className="text-muted-foreground">
              Get your unique chat URL instantly. Share with customers, embed on your website, or integrate into your workflow.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
};