
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { User, Users, Building2, Settings } from 'lucide-react';

import { TitleBar } from '@/features/dashboard/TitleBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AccountPage = async (props: { params: { locale: string } }) => {
  const t = await getTranslations('Account');

  return (
    <>
      <TitleBar
        title="Account Management"
        description="Manage your user profile, organization, and account settings"
      />

      <div className="space-y-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <User className="h-6 w-6 text-blue-600" />
              <div className="ml-3">
                <CardTitle className="text-lg">User Profile</CardTitle>
                <CardDescription>
                  Manage your personal information and preferences
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/user-profile">
                <Button variant="outline" className="w-full">
                  <User className="h-4 w-4 mr-2" />
                  Manage Profile
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Building2 className="h-6 w-6 text-green-600" />
              <div className="ml-3">
                <CardTitle className="text-lg">Organization</CardTitle>
                <CardDescription>
                  Manage organization settings and billing
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/organization-profile">
                <Button variant="outline" className="w-full">
                  <Building2 className="h-4 w-4 mr-2" />
                  Organization Settings
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Users className="h-6 w-6 text-purple-600" />
              <div className="ml-3">
                <CardTitle className="text-lg">Team Members</CardTitle>
                <CardDescription>
                  Invite and manage team members
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/organization-profile/organization-members">
                <Button variant="outline" className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Members
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Account Management Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Account Management
            </CardTitle>
            <CardDescription>
              Use the quick action buttons above to access different account management areas, or use the navigation menu to access specific sections.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Quick Access</h4>
                <p className="text-blue-800 text-sm">
                  Click the buttons above to quickly navigate to User Profile, Organization Settings, or Team Members management.
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">Centralized Management</h4>
                <p className="text-green-800 text-sm">
                  All your account settings are now organized in one place for easier access and management.
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
