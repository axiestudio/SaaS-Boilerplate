'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { buttonVariants } from '@/components/ui/buttonVariants';
import { Section } from '@/features/landing/Section';

export const CTA = () => {
  const t = useTranslations('CTA');
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <Section className="py-24">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-3xl" />

          {/* Animated Orbs */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl"
          />
        </div>

        {/* Content Container */}
        <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-12 md:p-16 text-center overflow-hidden">


          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent"
          >
            Ready to Transform Your Customer Support?
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Join thousands of businesses using our chat builder to deliver exceptional customer experiences. Start your free trial today.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.a
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={buttonVariants({
                size: 'lg',
                className: 'px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary group'
              })}
              href="/sign-up"
            >
              {t('button_text')}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={buttonVariants({
                variant: 'outline',
                size: 'lg',
                className: 'px-8 py-4 text-lg font-semibold border-2 hover:bg-muted/50 transition-all duration-300 backdrop-blur-sm'
              })}
              href="/chat/demo"
            >
              {t('demo_button')}
            </motion.a>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8"
          >
            <p className="text-sm text-muted-foreground">
              {t('trust_indicators')}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </Section>
  );
};