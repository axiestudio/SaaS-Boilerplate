import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Shield, ArrowLeft, Home, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

const AccessDeniedPage = () => {
  const t = useTranslations('AccessDenied');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Icon and Title */}
        <div className="space-y-6">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-lg">
            <Shield className="h-12 w-12 text-white" />
          </div>
          
          <div className="space-y-3">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {t('title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg mx-auto">
              {t('description')}
            </p>
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-8 space-y-4">
          <h2 className="text-lg font-semibold">{t('why_title')}</h2>
          <div className="text-muted-foreground space-y-2">
            <p>• {t('reason_1')}</p>
            <p>• {t('reason_2')}</p>
            <p>• {t('reason_3')}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard/chat-interfaces">
            <Button size="lg" className="w-full sm:w-auto">
              <Home className="h-5 w-5 mr-2" />
              {t('view_your_interfaces')}
            </Button>
          </Link>
          
          <Link href="/dashboard/chat-interfaces/new">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <Plus className="h-5 w-5 mr-2" />
              {t('create_new_interface')}
            </Button>
          </Link>
          
          <Link href="/dashboard">
            <Button variant="ghost" size="lg" className="w-full sm:w-auto">
              <ArrowLeft className="h-5 w-5 mr-2" />
              {t('back_to_dashboard')}
            </Button>
          </Link>
        </div>

        {/* Help Section */}
        <div className="text-sm text-muted-foreground">
          <p>{t('need_help')} <Link href="/support" className="text-primary hover:underline">{t('contact_support')}</Link></p>
        </div>
      </div>
    </div>
  );
};

export default AccessDeniedPage;
