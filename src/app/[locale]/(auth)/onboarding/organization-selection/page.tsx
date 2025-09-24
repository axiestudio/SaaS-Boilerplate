import { getTranslations } from 'next-intl/server';

import { LimitedOrganizationList } from '@/components/LimitedOrganizationList';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Dashboard',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

const OrganizationSelectionPage = () => (
  <div className="flex min-h-screen items-center justify-center p-6">
    <div className="w-full max-w-2xl">
      <LimitedOrganizationList
        afterSelectOrganizationUrl="/dashboard?org_selected=true"
        afterCreateOrganizationUrl="/dashboard?org_selected=true"
        afterSelectPersonalUrl="/dashboard?personal=true&org_selected=true"
        hidePersonal={false}
        skipInvitationScreen
      />
    </div>
  </div>
);

export const dynamic = 'force-dynamic';

export default OrganizationSelectionPage;
