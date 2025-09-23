import { notFound } from 'next/navigation';

import { TitleBar } from '@/features/dashboard/TitleBar';
import { ChatInterfaceForm } from '@/features/chat/ChatInterfaceForm';

// Mock function - replace with actual database query
async function getChatInterface(id: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/chat-interfaces/${id}`, {
      // Add cache control
      next: { revalidate: 0 } // Always fetch fresh data for editing
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching chat interface:', error);
    return null;
  }
  
  // Fallback mock data for development
  return {
    id: parseInt(id),
    name: 'Customer Support Chat',
    slug: 'customer-support-chat',
    apiEndpoint: 'https://flow.axiestudio.se/api/v1/run/f367b850-4b93-47a2-9cc2-b6562a674ba4',
    apiKey: 'your-api-key',
    brandName: 'TechCorp Support',
    logoUrl: '/axie-logo.webp',
    primaryColor: '#3B82F6',
    secondaryColor: '#F3F4F6',
    welcomeMessage: 'Hello! How can I help you today?',
    placeholderText: 'Type your message...',
    isActive: true,
  };
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