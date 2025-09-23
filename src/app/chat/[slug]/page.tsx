import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PublicChatInterface } from '@/features/chat/PublicChatInterface';

// This function will be used to fetch chat interface data for metadata
async function getChatInterfaceMetadata(slug: string) {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/chat-interfaces/public/${slug}`);
    // if (!response.ok) return null;
    // return await response.json();
    
    // Mock data for demonstration
    return {
      name: 'Customer Support Chat',
      brandName: 'TechCorp Support',
      isActive: true,
    };
  } catch (error) {
    console.error('Error fetching chat interface metadata:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const chatInterface = await getChatInterfaceMetadata(params.slug);
  
  if (!chatInterface) {
    return {
      title: 'Chat Not Found',
      description: 'The requested chat interface could not be found.',
    };
  }

  return {
    title: `${chatInterface.brandName} - Live Chat Support`,
    description: `Get instant help and support through our ${chatInterface.brandName} chat interface. We're here to assist you 24/7.`,
    openGraph: {
      title: `${chatInterface.brandName} - Live Chat Support`,
      description: `Get instant help and support through our ${chatInterface.brandName} chat interface.`,
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// This is the public chat interface that customers will use
const PublicChatPage = async ({ params }: { params: { slug: string } }) => {
  // Verify the chat interface exists and is active
  const chatInterface = await getChatInterfaceMetadata(params.slug);
  
  if (!chatInterface || !chatInterface.isActive) {
    notFound();
  }

  return <PublicChatInterface slug={params.slug} />;
};

export default PublicChatPage;