import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';

import { Hero } from '@/templates/Hero';
import { Navbar } from '@/templates/Navbar';
import { Features } from '@/templates/Features';
import { HowItWorks } from '@/features/landing/HowItWorks';
import { Benefits } from '@/features/landing/Benefits';
import { Pricing } from '@/templates/Pricing';
import { CTA } from '@/features/landing/CTA';
import { Footer } from '@/templates/Footer';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Index',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

const IndexPage = (props: { params: { locale: string } }) => {
  unstable_setRequestLocale(props.params.locale);

  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Benefits />
      <Pricing />
      <CTA />
      <Footer />
    </>
  );
};

export default IndexPage;