import { useTranslations } from 'next-intl';

export const DemoBadge = () => {
  const t = useTranslations('DemoBadge');

  return (
    <div className="fixed bottom-0 right-20 z-10">
      <a
        href="https://axiestudio.se"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="rounded-md bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-3 py-2 font-semibold text-white shadow-lg">
          <span className="text-gray-500">{t('powered_by')}</span>
          <span className="text-white font-bold"> {t('axie_studio')}</span>
        </div>
      </a>
    </div>
  );
};
