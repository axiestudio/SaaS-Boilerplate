import { CheckCircle } from 'lucide-react';

import { Section } from '@/features/landing/Section';

export const Benefits = () => {
  const benefits = [
    {
      title: "Reduce Support Costs",
      description: "Automate customer inquiries with AI-powered responses, reducing support ticket volume by up to 70%."
    },
    {
      title: "Improve Customer Satisfaction",
      description: "Provide instant 24/7 support with consistent, accurate responses that maintain your brand voice."
    },
    {
      title: "Scale Your Business",
      description: "Handle unlimited conversations simultaneously without adding support staff or infrastructure."
    },
    {
      title: "Maintain Brand Consistency",
      description: "Every interaction reflects your brand with customized colors, messaging, and professional appearance."
    },
    {
      title: "Quick Implementation",
      description: "Deploy in minutes, not weeks. No technical expertise required - just connect and customize."
    },
    {
      title: "Enterprise Ready",
      description: "Built for businesses of all sizes with security, analytics, and scalability features included."
    }
  ];

  return (
    <Section
      subtitle="Why Choose Axie Studio Chat Builder"
      title="Transform Your Customer Experience"
      description="Join hundreds of businesses already using our platform to deliver exceptional customer support."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-start space-x-4 p-6 bg-card rounded-lg border">
            <div className="flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};