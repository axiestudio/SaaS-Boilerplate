import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PublicChatInterface } from '@/features/chat/PublicChatInterface';

// This function will be used to fetch chat interface data for metadata
async function getChatInterfaceMetadata(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/chat-interfaces/public/${slug}`, {
      cache: 'no-store', // Always fetch fresh data for real-time updates
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    // Return data if it exists and is public (active)
    return data && data.isPublic ? data : null;
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
  
  if (!chatInterface || !chatInterface.isPublic) {
    notFound();
  }

  return <PublicChatInterface slug={params.slug} />;
};

// Enable static generation for better performance
export const dynamic = 'force-dynamic'; // Since we need to check real-time status

export default PublicChatPage;