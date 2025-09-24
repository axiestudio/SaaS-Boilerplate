'use client';

import { ArrowRight, Settings, Palette, Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import { Section } from '@/features/landing/Section';

export const HowItWorks = () => {
  const t = useTranslations('HowItWorksSection');
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
      },
    },
  };

  const steps = [
    {
      icon: <Settings className="w-8 h-8" />,
      title: t('step1_title'),
      description: t('step1_description'),
      gradient: 'from-blue-500 to-cyan-500',
      number: '01',
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: t('step2_title'),
      description: t('step2_description'),
      gradient: 'from-purple-500 to-pink-500',
      number: '02',
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: t('step3_title'),
      description: t('step3_description'),
      gradient: 'from-green-500 to-emerald-500',
      number: '03',
    },
  ];

  return (
    <Section
      subtitle={t('subtitle')}
      title={t('title')}
      description={t('description')}
    >
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="grid grid-cols-1 gap-12 md:grid-cols-3"
      >
        {steps.map((step, index) => (
          <motion.div
            key={index}
            variants={stepVariants}
            className="relative group"
          >
            {/* Step Number */}
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm border border-primary/20">
              {step.number}
            </div>

            {/* Icon Container */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
              className={`relative flex items-center justify-center w-20 h-20 mx-auto mb-8 bg-gradient-to-br ${step.gradient} rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
            >
              <div className="text-white">
                {step.icon}
              </div>
              {/* Glow effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300`} />
            </motion.div>

            {/* Content */}
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors duration-300">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>

            {/* Arrow (except for last step) */}
            {index < steps.length - 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.2 }}
                className="hidden md:block absolute top-10 -right-6 text-muted-foreground/50"
              >
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight className="w-8 h-8" />
                </motion.div>
              </motion.div>
            )}

            {/* Connecting line for mobile */}
            {index < steps.length - 1 && (
              <div className="md:hidden flex justify-center mt-8">
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={inView ? { scaleY: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                  className="w-px h-12 bg-gradient-to-b from-primary/50 to-transparent"
                />
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
};