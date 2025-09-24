import { getTranslations } from 'next-intl/server';
import { Sparkles, MessageCircle, Zap } from 'lucide-react';

import { ChatInterfaceForm } from '@/features/chat/ChatInterfaceForm';

const NewChatInterfacePage = async () => {
  const t = await getTranslations('ChatInterface');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-8 mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-pulse" />
        <div className="relative">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-3xl flex items-center justify-center shadow-lg">
              <MessageCircle className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {t('create_new')}
              </h1>
              <p className="text-lg text-muted-foreground">
                {t('create_new_description')}
              </p>
            </div>
          </div>

          {/* Quick Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="flex items-center gap-3 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">Deploy in Minutes</p>
                <p className="text-xs text-muted-foreground">Get your chat live instantly</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">Full Customization</p>
                <p className="text-xs text-muted-foreground">Match your brand perfectly</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">AI-Powered</p>
                <p className="text-xs text-muted-foreground">Connect to Axie Studio flows</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Component */}
      <ChatInterfaceForm />
    </div>
  );
};

export default NewChatInterfacePage;