'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useSpring, animated } from '@react-spring/web';

import { buttonVariants } from '@/components/ui/buttonVariants';
import { Section } from '@/features/landing/Section';

export const Hero = () => {
  const t = useTranslations('Hero');
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Spring animations for floating elements
  const floatingAnimation = useSpring({
    from: { transform: 'translateY(0px)' },
    to: async (next) => {
      while (true) {
        await next({ transform: 'translateY(-10px)' });
        await next({ transform: 'translateY(0px)' });
      }
    },
    config: { duration: 3000 },
  });

  return (
    <Section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient Orbs */}
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
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-green-400/20 via-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <motion.div
        ref={containerRef}
        style={{ y, opacity } as any}
        className="mx-auto max-w-screen-xl px-3 w-full"
      >
        <div className="text-center">
          {/* Status Badge */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="inline-flex items-center mb-8"
          >
            <div className="relative">
              <div className="inline-flex items-center rounded-full border border-border/50 bg-background/80 backdrop-blur-sm px-4 py-2 text-sm font-medium shadow-lg">
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mr-2 h-2 w-2 rounded-full bg-green-500"
                />
                {t('banner_text')}
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-green-500/20 blur-md animate-pulse" />
            </div>
          </motion.div>

          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[0.9] bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
              <span dangerouslySetInnerHTML={{ __html: t.raw('title') }} />
            </h1>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mx-auto max-w-3xl text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12"
          >
            {t('description')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <motion.a
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={buttonVariants({
                size: 'lg',
                className: 'px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary'
              })}
              href="/sign-up"
            >
              {t('primary_button')}
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
              {t('secondary_button')}
            </motion.a>
          </motion.div>


        </div>

        {/* Floating Elements */}
        <animated.div
          style={floatingAnimation}
          className="absolute top-20 left-10 w-4 h-4 bg-blue-500/30 rounded-full blur-sm"
        />
        <animated.div
          style={floatingAnimation}
          className="absolute top-40 right-20 w-6 h-6 bg-purple-500/30 rounded-full blur-sm"
        />
        <animated.div
          style={floatingAnimation}
          className="absolute bottom-40 left-20 w-3 h-3 bg-green-500/30 rounded-full blur-sm"
        />
      </motion.div>
    </Section>
  );
};