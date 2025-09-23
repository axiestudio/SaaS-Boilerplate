import { useTranslations } from 'next-intl';

import { TitleBar } from '@/features/dashboard/TitleBar';
import { ChatInterfaceForm } from '@/features/chat/ChatInterfaceForm';

const NewChatInterfacePage = () => {
  const t = useTranslations('ChatInterface');

  return (
    <>
      <TitleBar
        title="Create New Chat Interface"
        description="Set up a new chat interface for your customers"
      />

      <div className="max-w-4xl">
        <ChatInterfaceForm />
      </div>
    </>
  );
};

export default NewChatInterfacePage;