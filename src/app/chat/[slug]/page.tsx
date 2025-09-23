import { notFound } from 'next/navigation';

import { PublicChatInterface } from '@/features/chat/PublicChatInterface';

// This is the public chat interface that customers will use
const PublicChatPage = async ({ params }: { params: { slug: string } }) => {
  // TODO: Fetch chat interface configuration by slug
  const chatInterface = null; // await getChatInterfaceBySlug(params.slug);
  
  if (!chatInterface) {
    notFound();
  }

  return <PublicChatInterface slug={params.slug} />;
};

export default PublicChatPage;