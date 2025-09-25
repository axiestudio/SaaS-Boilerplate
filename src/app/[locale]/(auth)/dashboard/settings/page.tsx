import { useTranslations } from 'next-intl';

import { TitleBar } from '@/features/dashboard/TitleBar';
import { DashboardSection } from '@/features/dashboard/DashboardSection';
import { ApiSettingsForm } from '@/features/settings/ApiSettingsForm';

const SettingsPage = () => {
  const t = useTranslations('Settings');

  return (
    <>
      <TitleBar
        title={t('title_bar')}
        description={t('title_bar_description')}
      />

      <div className="max-w-2xl space-y-6">
        <DashboardSection
          title={t('api_configuration_title')}
          description={t('api_configuration_description')}
        >
          <ApiSettingsForm />
        </DashboardSection>
      </div>
    </>
  );
};

export default SettingsPage;