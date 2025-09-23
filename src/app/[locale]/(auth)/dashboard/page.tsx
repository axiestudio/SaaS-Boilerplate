import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Plus, Settings, ExternalLink, MessageCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DashboardSection } from '@/features/dashboard/DashboardSection';
import { TitleBar } from '@/features/dashboard/TitleBar';
import { ChatInterfaceList } from '@/features/chat/ChatInterfaceList';

const DashboardIndexPage = () => {
  const t = useTranslations('DashboardIndex');

  return (
    <>
      {/* 🎯 CENTERED TITLE BAR */}
      <div className="text-center mb-8">
        <div className="text-2xl font-semibold">{t('title_bar')}</div>
        <div className="text-sm font-medium text-muted-foreground">
          {t('title_bar_description')}
        </div>
      </div>

      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Quick Actions */}
        <DashboardSection
          title="Quick Actions"
          description="Get started with creating your first chat interface"
        >
          <div className="flex flex-wrap gap-4">
            <Link href="/dashboard/chat-interfaces/new">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create New Chat Interface
              </Button>
            </Link>
            <Link href="/dashboard/account">
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Account Settings
              </Button>
            </Link>
          </div>
        </DashboardSection>

        {/* Chat Interfaces Overview */}
        <DashboardSection
          title="Your Chat Interfaces"
          description="Manage and customize your chat interfaces"
        >
          <ChatInterfaceList />
        </DashboardSection>

        {/* Getting Started Guide */}
        <DashboardSection
          title="Getting Started"
          description="Follow these steps to set up your first chat interface"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <h3 className="font-semibold">Configure API</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Set up your Axie Studio API endpoint and key
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <h3 className="font-semibold">Customize Interface</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Brand your chat interface with colors, logo, and messages
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <h3 className="font-semibold">Share & Deploy</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Get your unique chat URL and share it with your customers
              </p>
            </div>
          </div>
        </DashboardSection>
      </div>
    </>
  );
};

export default DashboardIndexPage;