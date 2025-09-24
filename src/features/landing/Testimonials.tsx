'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star } from 'lucide-react';

import { Section } from '@/features/landing/Section';

export const Testimonials = () => {
  const t = useTranslations('TestimonialsSection');
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

  const cardVariants = {
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

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Head of Customer Success",
      company: "TechFlow Inc",
      content: "The chat interface builder transformed our customer support. Setup took minutes, not weeks. Our response times improved by 60%.",
      rating: 5,
      avatar: "SJ",
    },
    {
      name: "Michael Chen",
      role: "Product Manager",
      company: "StartupXYZ",
      content: "Professional, customizable, and incredibly easy to implement. Our customers love the seamless experience.",
      rating: 5,
      avatar: "MC",
    },
    {
      name: "Emily Rodriguez",
      role: "CTO",
      company: "GrowthCorp",
      content: "Best investment we made this year. The real-time branding features are exactly what we needed for our multi-brand strategy.",
      rating: 5,
      avatar: "ER",
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
        className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
      >
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{ 
              y: -8,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            className="group relative"
          >
            <div className="relative h-full p-8 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 transition-all duration-500 hover:shadow-xl hover:shadow-black/5 overflow-hidden">
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Rating Stars */}
              <div className="flex space-x-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-muted-foreground leading-relaxed mb-8 relative">
                <span className="text-4xl text-primary/20 absolute -top-2 -left-2">"</span>
                {testimonial.content}
                <span className="text-4xl text-primary/20 absolute -bottom-4 -right-2">"</span>
              </blockquote>

              {/* Author */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
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
