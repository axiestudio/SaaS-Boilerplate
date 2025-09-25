import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';

// Import English messages as fallback for public chat
import enMessages from '@/locales/en.json';

export const metadata = {
  title: 'Chat Interface',
  description: 'AI-powered chat interface',
}

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Provide English translations as fallback for public chat interfaces
  // This ensures the chat works even when accessed directly without i18n context
  return (
    <html lang="en">
      <body>
        <NextIntlClientProvider
          locale="en"
          messages={enMessages}
        >
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}