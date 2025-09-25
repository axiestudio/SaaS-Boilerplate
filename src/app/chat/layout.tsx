import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat Interface',
  description: 'AI-powered chat interface',
};

// Simple layout without any i18n dependencies
export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}