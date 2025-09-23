import { useTranslations } from 'next-intl';

import { TitleBar } from '@/features/dashboard/TitleBar';
import { DashboardSection } from '@/features/dashboard/DashboardSection';
import { ApiSettingsForm } from '@/features/settings/ApiSettingsForm';

const SettingsPage = () => {
  const t = useTranslations('Settings');

  return (
    <>
      <TitleBar
        title="Settings"
        description="Manage your API settings and preferences"
      />

      <div className="max-w-2xl space-y-6">
        <DashboardSection
          title="API Configuration"
          description="Configure your default Axie Studio API settings"
        >
          <ApiSettingsForm />
        </DashboardSection>
      </div>
    </>
  );
};

export default SettingsPage;