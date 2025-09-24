import { OrganizationList } from '@clerk/nextjs';
import { getTranslations } from 'next-intl/server';

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
  <div className="flex min-h-screen items-center justify-center">
    <OrganizationList
      afterSelectOrganizationUrl="/dashboard"
      afterCreateOrganizationUrl="/dashboard"
      afterSelectPersonalUrl="/dashboard?personal=true"
      hidePersonal={false}
      skipInvitationScreen
    />
  </div>
);

export const dynamic = 'force-dynamic';

export default OrganizationSelectionPage;
