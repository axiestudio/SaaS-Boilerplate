'use client';

import { CheckCircle, TrendingUp, Users, Zap, Shield, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import { Section } from '@/features/landing/Section';

export const Benefits = () => {
  const t = useTranslations('BenefitsSection');
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

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
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  const benefits = [
    {
      icon: <TrendingUp className="w-7 h-7" />,
      title: t('reduce_costs_title'),
      description: t('reduce_costs_description'),
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: t('improve_satisfaction_title'),
      description: t('improve_satisfaction_description'),
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <Zap className="w-7 h-7" />,
      title: t('scale_business_title'),
      description: t('scale_business_description'),
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      icon: <CheckCircle className="w-7 h-7" />,
      title: t('brand_consistency_title'),
      description: t('brand_consistency_description'),
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: <Clock className="w-7 h-7" />,
      title: t('quick_implementation_title'),
      description: t('quick_implementation_description'),
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: t('enterprise_ready_title'),
      description: t('enterprise_ready_description'),
      gradient: 'from-red-500 to-pink-500',
    }
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
        className="grid grid-cols-1 gap-8 md:grid-cols-2"
      >
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{
              y: -5,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            className="group relative"
          >
            <div className="relative h-full p-8 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 transition-all duration-500 hover:shadow-xl hover:shadow-black/5 overflow-hidden">
              {/* Background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

              {/* Icon with enhanced styling */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
                className={`relative inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${benefit.gradient} text-white shadow-lg mb-6 group-hover:shadow-xl transition-shadow duration-300`}
              >
                {benefit.icon}
                {/* Glow effect */}
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-300`} />
              </motion.div>

              {/* Content */}
              <div className="relative">
                <h3 className="text-xl font-bold mb-4 text-card-foreground group-hover:text-primary transition-colors duration-300">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>

              {/* Subtle shine effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
};