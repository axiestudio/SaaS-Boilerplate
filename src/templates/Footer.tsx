'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import { Section } from '@/features/landing/Section';
import { AppConfig } from '@/utils/AppConfig';

import { Logo } from './Logo';

export const Footer = () => {
  const t = useTranslations('Footer');
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <Section className="pb-16 pt-24 border-t border-border/50">
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="text-center"
      >
        {/* Logo and Company Name */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {AppConfig.name}
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {t('description')}
          </p>
        </motion.div>

        {/* Legal Links */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <Link
              href="/terms"
              className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:underline"
            >
              {t('terms_of_service')}
            </Link>
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:underline"
            >
              {t('privacy_policy')}
            </Link>
            <Link
              href="/contact"
              className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:underline"
            >
              {t('contact')}
            </Link>
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          variants={itemVariants}
          className="pt-8 border-t border-border/30"
        >
          <p className="text-sm text-muted-foreground">
            {t('copyright', { year: new Date().getFullYear(), name: AppConfig.name })}
          </p>
        </motion.div>
      </motion.div>
    </Section>
  );
};