import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { eq, and } from 'drizzle-orm';
import { getTranslations } from 'next-intl/server';
import { Settings, MessageCircle, Palette, Globe, Lock } from 'lucide-react';

import { ChatInterfaceForm } from '@/features/chat/ChatInterfaceForm';
import { db } from '@/libs/DB';
import { chatInterfaceSchema } from '@/models/Schema';

async function getChatInterface(id: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return null;
    }

    const chatInterfaceId = parseInt(id);
    if (isNaN(chatInterfaceId)) {
      return null;
    }

    // Fetch directly from database with authentication
    const chatInterface = await db.query.chatInterfaceSchema.findFirst({
      where: and(
        eq(chatInterfaceSchema.id, chatInterfaceId),
        eq(chatInterfaceSchema.ownerId, userId)
      ),
    });

    return chatInterface || null;
  } catch (error) {
    console.error('Error fetching chat interface:', error);
    return null;
  }
}

const EditChatInterfacePage = async ({ params }: { params: { id: string } }) => {
  const chatInterface = await getChatInterface(params.id);
  const t = await getTranslations('ChatInterface');

  if (!chatInterface) {
    notFound();
  }

  return (
    <>
      {/* Enhanced Header for Edit Page */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-8 mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-pulse" />
        <div className="relative">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl flex items-center justify-center shadow-lg">
                <Settings className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  {t('edit_title', { name: chatInterface.name })}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {t('edit_description')}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 ${
              chatInterface.isActive 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              {chatInterface.isActive ? (
                <Globe className="h-4 w-4" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
              <span className="font-semibold text-sm">
                {chatInterface.isActive ? 'Public' : 'Private'}
              </span>
            </div>
          </div>

          {/* Interface Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">Chat Interface</p>
                <p className="text-xs text-muted-foreground">ID: {chatInterface.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Palette className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">Brand</p>
                <p className="text-xs text-muted-foreground">{chatInterface.brandName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Globe className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">URL Slug</p>
                <p className="text-xs text-muted-foreground font-mono">{chatInterface.slug}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Settings className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">Created</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(chatInterface.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Component */}
      <ChatInterfaceForm
        initialData={chatInterface}
        isEditing={true}
      />
    </>
  );
};

// Force dynamic rendering for edit pages
export const dynamic = 'force-dynamic';

export default EditChatInterfacePage;