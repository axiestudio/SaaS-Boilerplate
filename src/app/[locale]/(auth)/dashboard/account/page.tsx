
import { auth } from '@clerk/nextjs/server';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { User, Users, Building2, Settings } from 'lucide-react';

import { TitleBar } from '@/features/dashboard/TitleBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AccountPage = async (props: { params: { locale: string } }) => {
  const t = await getTranslations('AccountPage');
  const { orgId } = await auth();

  return (
    <>
      <TitleBar
        title={t('title')}
        description={t('description')}
      />

      <div className="space-y-8">
        {/* Quick Actions */}
        <div className={`grid grid-cols-1 ${orgId ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <User className="h-6 w-6 text-blue-600" />
              <div className="ml-3">
                <CardTitle className="text-lg">{t('user_profile_title')}</CardTitle>
                <CardDescription>
                  {t('user_profile_description')}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/user-profile">
                <Button variant="outline" className="w-full">
                  <User className="h-4 w-4 mr-2" />
                  {t('manage_profile')}
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Building2 className="h-6 w-6 text-green-600" />
              <div className="ml-3">
                <CardTitle className="text-lg">{t('organization_title')}</CardTitle>
                <CardDescription>
                  {t('organization_description')}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/organization-profile">
                <Button variant="outline" className="w-full">
                  <Building2 className="h-4 w-4 mr-2" />
                  {t('organization_settings')}
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Only show organization features if user is in an organization */}
          {orgId && (
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Users className="h-6 w-6 text-purple-600" />
                <div className="ml-3">
                  <CardTitle className="text-lg">{t('team_members_title')}</CardTitle>
                  <CardDescription>
                    {t('team_members_description')}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard/organization-profile/organization-members">
                  <Button variant="outline" className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    {t('manage_members')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Account Management Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              {t('account_management_title')}
            </CardTitle>
            <CardDescription>
              {t('account_management_description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">{t('quick_access_title')}</h4>
                <p className="text-blue-800 text-sm">
                  {t('quick_access_description')}
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">{t('centralized_management_title')}</h4>
                <p className="text-green-800 text-sm">
                  {t('centralized_management_description')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AccountPage;
