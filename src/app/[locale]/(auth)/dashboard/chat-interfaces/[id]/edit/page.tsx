import { notFound } from 'next/navigation';

import { TitleBar } from '@/features/dashboard/TitleBar';
import { ChatInterfaceForm } from '@/features/chat/ChatInterfaceForm';

async function getChatInterface(id: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/chat-interfaces/${id}`, {
      next: { revalidate: 0 }, // Always fetch fresh data for editing
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching chat interface:', error);
    return null;
  }
}

const EditChatInterfacePage = async ({ params }: { params: { id: string } }) => {
  const chatInterface = await getChatInterface(params.id);
  
  if (!chatInterface) {
    notFound();
  }

  return (
    <>
      <TitleBar
        title={`Edit: ${chatInterface.name}`}
        description="Update your chat interface configuration and branding"
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