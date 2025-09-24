import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { eq, and } from 'drizzle-orm';
import { getTranslations } from 'next-intl/server';

import { TitleBar } from '@/features/dashboard/TitleBar';
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
      <TitleBar
        title={t('edit_title', { name: chatInterface.name })}
        description={t('edit_description')}
      />

      <div className="max-w-7xl">
        <ChatInterfaceForm 
          initialData={chatInterface} 
          isEditing={true}
        />
      </div>
    </>
  );
};

// Force dynamic rendering for edit pages
export const dynamic = 'force-dynamic';

export default EditChatInterfacePage;