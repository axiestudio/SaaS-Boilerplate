import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PublicChatInterface } from '@/features/chat/PublicChatInterface';

// This function will be used to fetch chat interface data for metadata
async function getChatInterfaceMetadata(slug: string) {
  try {
    // For server-side rendering, we can directly import and use the database
    // This avoids the need for HTTP calls and environment URL issues
    const { db } = await import('@/libs/DB');
    const { chatInterfaceSchema } = await import('@/models/Schema');
    const { eq, and } = await import('drizzle-orm');

    const chatInterface = await db.query.chatInterfaceSchema.findFirst({
      where: and(
        eq(chatInterfaceSchema.slug, slug),
        eq(chatInterfaceSchema.isActive, true)
      ),
      columns: {
        id: true,
        name: true,
        brandName: true,
        logoUrl: true,
        primaryColor: true,
        secondaryColor: true,
        welcomeMessage: true,
        placeholderText: true,
        apiEndpoint: true,
        apiKey: true,
        isActive: true,
      },
    });

    if (!chatInterface) {
      return null;
    }

    return {
      ...chatInterface,
      isPublic: chatInterface.isActive // Use isActive as isPublic since they represent the same concept
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
  
  if (!chatInterface || !chatInterface.isPublic) {
    notFound();
  }

  return <PublicChatInterface slug={params.slug} />;
};

// Enable static generation for better performance
export const dynamic = 'force-dynamic'; // Since we need to check real-time status

export default PublicChatPage;