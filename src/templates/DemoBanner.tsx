import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { StickyBanner } from '@/features/landing/StickyBanner';

export const DemoBanner = () => {
  const t = useTranslations('DemoBanner');

  return (
    <StickyBanner>
      {t('text')}
      {' '}
      <Link href="/sign-up">{t('link_text')}</Link>
    </StickyBanner>
  );
};
