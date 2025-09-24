'use client';

import { useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Plus, Minus } from 'lucide-react';

import { Section } from '@/features/landing/Section';

export const FAQ = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  const faqs = [
    {
      question: "How quickly can I deploy a chat interface?",
      answer: "You can have a fully functional chat interface deployed in under 5 minutes. Simply connect to your Axie Studio flow, customize your branding, and share your unique URL."
    },
    {
      question: "Can I customize the chat interface to match my brand?",
      answer: "Absolutely! You have complete control over colors, logos, messaging, and overall appearance. Upload your brand assets and see real-time previews as you customize."
    },
    {
      question: "What integrations are supported?",
      answer: "Our platform seamlessly integrates with Axie Studio flows, and we're continuously adding support for popular CRM systems, helpdesk tools, and analytics platforms."
    },
    {
      question: "Is there a limit on the number of conversations?",
      answer: "No limits on conversations! Our infrastructure scales automatically to handle any volume, from a few chats per day to thousands of concurrent conversations."
    },
    {
      question: "What kind of analytics and insights do you provide?",
      answer: "Get detailed insights into conversation volume, response times, user satisfaction, popular topics, and conversion metrics. All data is presented in easy-to-understand dashboards."
    },
    {
      question: "Is my data secure and compliant?",
      answer: "Yes, we take security seriously. All data is encrypted in transit and at rest, we're SOC 2 compliant, and we follow GDPR and other privacy regulations."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Section
      subtitle="FAQ"
      title="Frequently Asked Questions"
      description="Everything you need to know about our chat interface builder"
    >
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="max-w-3xl mx-auto"
      >
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="mb-4"
          >
            <motion.button
              onClick={() => toggleFAQ(index)}
              className="w-full text-left p-6 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl hover:shadow-lg transition-all duration-300 group"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0 ml-4"
                >
                  {openIndex === index ? (
                    <Minus className="w-5 h-5 text-primary" />
                  ) : (
                    <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                  )}
                </motion.div>
              </div>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 border-t border-border/30 mt-4">
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        ))}
      </motion.div>

      {/* Contact CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="text-center mt-12 p-8 bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl border border-primary/20"
      >
        <h3 className="text-xl font-semibold mb-3">Still have questions?</h3>
        <p className="text-muted-foreground mb-6">
          Our team is here to help you get started with your chat interface.
        </p>
        <motion.a
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          href="mailto:support@axiestudio.se"
          className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200"
        >
          Contact Support
        </motion.a>
      </motion.div>
    </Section>
  );
};
