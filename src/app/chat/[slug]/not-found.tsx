import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function ChatNotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
        <div className="text-6xl mb-4">🤖</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Chat Not Found</h1>
        <p className="text-gray-600 mb-6">
          The chat interface you're looking for doesn't exist or has been disabled.
        </p>
        <Link href="/">
          <Button>
            Go to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}