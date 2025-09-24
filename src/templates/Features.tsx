'use client';

import { useTranslations } from 'next-intl';
import { MessageCircle, Palette, Zap, BarChart3, Globe, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import { Background } from '@/components/Background';
import { Section } from '@/features/landing/Section';

export const Features = () => {
  const t = useTranslations('FeaturesSection');
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

  const features = [
    {
      icon: <Palette className="h-8 w-8" />,
      title: t('custom_branding_title'),
      description: t('custom_branding_description'),
      gradient: 'from-purple-500 to-pink-500',
      delay: 0,
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: t('realtime_conversations_title'),
      description: t('realtime_conversations_description'),
      gradient: 'from-blue-500 to-cyan-500',
      delay: 0.1,
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: t('axie_integration_title'),
      description: t('axie_integration_description'),
      gradient: 'from-yellow-500 to-orange-500',
      delay: 0.2,
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: t('instant_deployment_title'),
      description: t('instant_deployment_description'),
      gradient: 'from-green-500 to-emerald-500',
      delay: 0.3,
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: t('analytics_insights_title'),
      description: t('analytics_insights_description'),
      gradient: 'from-indigo-500 to-purple-500',
      delay: 0.4,
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: t('enterprise_security_title'),
      description: t('enterprise_security_description'),
      gradient: 'from-red-500 to-pink-500',
      delay: 0.5,
    },
  ];

  return (
    <Background>
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
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                y: -8,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              className="group relative"
            >
              <div className="relative h-full rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-black/10 overflow-hidden">
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                {/* Animated border */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-border to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                     style={{
                       background: `linear-gradient(90deg, transparent, hsl(var(--border)), transparent)`,
                       maskImage: 'linear-gradient(90deg, transparent 0%, black 50%, transparent 100%)',
                     }}
                />

                {/* Icon with enhanced styling */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                  className={`relative inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg mb-6 group-hover:shadow-xl transition-shadow duration-300`}
                >
                  {feature.icon}
                  {/* Glow effect */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300`} />
                </motion.div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-xl font-bold mb-4 text-card-foreground group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Subtle shine effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Section>
    </Background>
  );
};