'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform } from 'framer-motion';

import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { Section } from '@/features/landing/Section';

import { Logo } from './Logo';

export const Navbar = () => {
  const t = useTranslations('Navbar');
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.8)']
  );

  const backdropBlur = useTransform(
    scrollY,
    [0, 100],
    ['blur(0px)', 'blur(12px)']
  );

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setIsScrolled(latest > 50);
    });
    return () => unsubscribe();
  }, [scrollY]);

  return (
    <motion.div
      style={{
        backgroundColor,
        backdropFilter: backdropBlur,
      } as any}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'border-b border-border/20 shadow-sm' : ''
      }`}
    >
      <Section className="px-3 py-4">
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center justify-between"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Logo />
          </motion.div>

          {/* Right Menu */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center space-x-6"
          >
            <LocaleSwitcher />

            <Link
              href="/sign-in"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {t('sign_in')}
            </Link>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                className={buttonVariants({
                  size: 'sm',
                  className: 'shadow-sm hover:shadow-md transition-all duration-200 px-6'
                })}
                href="/sign-up"
              >
                {t('sign_up')}
              </Link>
            </motion.div>
          </motion.div>
        </motion.nav>
      </Section>
    </motion.div>
  );
};