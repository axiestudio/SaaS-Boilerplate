import { useTranslations } from 'next-intl';

import { TitleBar } from '@/features/dashboard/TitleBar';
import { ChatInterfaceForm } from '@/features/chat/ChatInterfaceForm';

const NewChatInterfacePage = () => {
  const t = useTranslations('ChatInterface');

  return (
    <>
      <TitleBar
        title={t('create_new')}
        description={t('create_new_description')}
      />

      {/* Remove max-width constraint to allow full-width layout */}
      <div className="w-full">
        <ChatInterfaceForm />
      </div>
    </>
  );
};

export default NewChatInterfacePage;