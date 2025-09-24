import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { User, Users, Building2, Settings, Shield, CreditCard, Bell, Globe, Sparkles, ArrowRight, ChevronRight } from 'lucide-react';

import { TitleBar } from '@/features/dashboard/TitleBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AccountPage = async (props: { params: { locale: string } }) => {
  const t = await getTranslations('AccountPage');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Enhanced Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-8 mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-pulse" />
        <div className="relative">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-3xl flex items-center justify-center shadow-lg">
              <Settings className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {t('title')}
              </h1>
              <p className="text-lg text-muted-foreground">
                {t('description')}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">{t('security_status')}</p>
                <p className="text-xs text-muted-foreground">{t('secure')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Globe className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">{t('account_status')}</p>
                <p className="text-xs text-muted-foreground">{t('active')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">{t('billing_status')}</p>
                <p className="text-xs text-muted-foreground">{t('up_to_date')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Bell className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">{t('notifications')}</p>
                <p className="text-xs text-muted-foreground">{t('enabled')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Primary Management Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Profile Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Card className="relative h-full bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-8 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full -translate-y-16 translate-x-16" />
              
              <CardHeader className="p-0 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <User className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-foreground group-hover:text-blue-600 transition-colors duration-300">
                      {t('user_profile_title')}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {t('user_profile_description')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>{t('profile_features.personal_info')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>{t('profile_features.security_settings')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>{t('profile_features.preferences')}</span>
                  </div>
                </div>
                
                <Link href="/dashboard/user-profile" className="block">
                  <Button className="w-full h-12 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <User className="h-4 w-4 mr-2" />
                    {t('manage_profile')}
                    <ChevronRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </Link>
              </CardContent>
              
              {/* Shine Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            </Card>
          </div>

          {/* Organization Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Card className="relative h-full bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-8 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-500 overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/5 to-transparent rounded-full -translate-y-16 translate-x-16" />
              
              <CardHeader className="p-0 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <Building2 className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-foreground group-hover:text-green-600 transition-colors duration-300">
                      {t('organization_title')}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {t('organization_description')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>{t('org_features.billing_management')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>{t('org_features.subscription_control')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>{t('org_features.organization_settings')}</span>
                  </div>
                </div>
                
                <Link href="/dashboard/organization-profile" className="block">
                  <Button className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <Building2 className="h-4 w-4 mr-2" />
                    {t('organization_settings')}
                    <ChevronRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </Link>
              </CardContent>
              
              {/* Shine Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            </Card>
          </div>

          {/* Team Members Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Card className="relative h-full bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-8 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-500 overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/5 to-transparent rounded-full -translate-y-16 translate-x-16" />
              
              <CardHeader className="p-0 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-foreground group-hover:text-purple-600 transition-colors duration-300">
                      {t('team_members_title')}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {t('team_members_description')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>{t('team_features.invite_members')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>{t('team_features.role_management')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>{t('team_features.permissions')}</span>
                  </div>
                </div>
                
                <Link href="/dashboard/organization-profile/organization-members" className="block">
                  <Button className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <Users className="h-4 w-4 mr-2" />
                    {t('manage_members')}
                    <ChevronRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </Link>
              </CardContent>
              
              {/* Shine Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            </Card>
          </div>
        </div>

        {/* Secondary Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Security Settings */}
          <div className="group">
            <Card className="h-full bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300 group-hover:scale-105">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{t('security_title')}</h3>
                  <p className="text-xs text-muted-foreground">{t('security_description')}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full group-hover:border-red-500/50 transition-colors duration-200">
                {t('manage_security')}
              </Button>
            </Card>
          </div>

          {/* Billing & Subscription */}
          <div className="group">
            <Card className="h-full bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:shadow-lg hover:shadow-yellow-500/10 transition-all duration-300 group-hover:scale-105">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{t('billing_title')}</h3>
                  <p className="text-xs text-muted-foreground">{t('billing_description')}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full group-hover:border-yellow-500/50 transition-colors duration-200">
                {t('manage_billing')}
              </Button>
            </Card>
          </div>

          {/* Notifications */}
          <div className="group">
            <Card className="h-full bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 group-hover:scale-105">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Bell className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{t('notifications_title')}</h3>
                  <p className="text-xs text-muted-foreground">{t('notifications_description')}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full group-hover:border-indigo-500/50 transition-colors duration-200">
                {t('manage_notifications')}
              </Button>
            </Card>
          </div>

          {/* API Settings */}
          <div className="group">
            <Card className="h-full bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 group-hover:scale-105">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                  <Globe className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{t('api_title')}</h3>
                  <p className="text-xs text-muted-foreground">{t('api_description')}</p>
                </div>
              </div>
              <Link href="/dashboard/settings">
                <Button variant="outline" size="sm" className="w-full group-hover:border-emerald-500/50 transition-colors duration-200">
                  {t('manage_api')}
                </Button>
              </Link>
            </Card>
          </div>
        </div>

        {/* Enhanced Help & Support Section */}
        <Card className="bg-gradient-to-br from-primary/5 via-transparent to-primary/5 border border-primary/10 rounded-3xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{t('help_support_title')}</h2>
                <p className="text-muted-foreground">{t('help_support_description')}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quick Start Guide */}
            <div className="relative p-6 bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl hover:shadow-lg transition-all duration-300 group">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg">
                1
              </div>
              <div className="mt-2">
                <h3 className="font-semibold mb-2 group-hover:text-blue-600 transition-colors duration-200">{t('quick_start_title')}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {t('quick_start_description')}
                </p>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 p-0 h-auto font-semibold">
                  {t('view_guide')} <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>

            {/* Documentation */}
            <div className="relative p-6 bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl hover:shadow-lg transition-all duration-300 group">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg">
                2
              </div>
              <div className="mt-2">
                <h3 className="font-semibold mb-2 group-hover:text-green-600 transition-colors duration-200">{t('documentation_title')}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {t('documentation_description')}
                </p>
                <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 p-0 h-auto font-semibold">
                  {t('read_docs')} <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>

            {/* Support Contact */}
            <div className="relative p-6 bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl hover:shadow-lg transition-all duration-300 group">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg">
                3
              </div>
              <div className="mt-2">
                <h3 className="font-semibold mb-2 group-hover:text-purple-600 transition-colors duration-200">{t('support_title')}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {t('support_description')}
                </p>
                <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 p-0 h-auto font-semibold">
                  {t('contact_support')} <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Account Overview Card */}
        <Card className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{t('account_overview_title')}</h2>
              <p className="text-sm text-muted-foreground">{t('account_overview_description')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Account Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                {t('account_info_title')}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm font-medium">{t('account_type')}</span>
                  <span className="text-sm text-muted-foreground">{t('individual_account')}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm font-medium">{t('member_since')}</span>
                  <span className="text-sm text-muted-foreground">{t('member_date')}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm font-medium">{t('last_login')}</span>
                  <span className="text-sm text-muted-foreground">{t('recent_login')}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                {t('quick_actions_title')}
              </h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start h-12 text-left">
                  <User className="h-4 w-4 mr-3" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">{t('update_profile')}</div>
                    <div className="text-xs text-muted-foreground">{t('update_profile_desc')}</div>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                
                <Button variant="outline" className="w-full justify-start h-12 text-left">
                  <Shield className="h-4 w-4 mr-3" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">{t('security_settings')}</div>
                    <div className="text-xs text-muted-foreground">{t('security_settings_desc')}</div>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                
                <Button variant="outline" className="w-full justify-start h-12 text-left">
                  <Bell className="h-4 w-4 mr-3" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">{t('notification_preferences')}</div>
                    <div className="text-xs text-muted-foreground">{t('notification_preferences_desc')}</div>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AccountPage;