import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import { DashboardHeader } from '@/features/dashboard/DashboardHeader';

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

export default function DashboardLayout(props: { children: React.ReactNode }) {
  const t = useTranslations('DashboardLayout');

  return (
    <>
      <div className="bg-card/50 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between px-6 py-4">
          <DashboardHeader
            menu={[
              {
                href: '/dashboard',
                label: t('home'),
              },
              {
                href: '/dashboard/chat-interfaces/new',
                label: t('create_chat'),
              },
              {
                href: '/dashboard/account',
                label: t('account'),
              },
            ]}
          />
        </div>
      </div>

      <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="mx-auto max-w-screen-xl px-6 pb-16 pt-8">
          {props.children}
        </div>
      </div>
    </>
  );
}

export const dynamic = 'force-dynamic';