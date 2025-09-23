import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function ChatNotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="text-center p-8 bg-white rounded-2xl shadow-2xl max-w-md mx-4 border border-slate-200">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <div className="text-3xl">🔒</div>
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-3">Chat Interface Not Available</h1>
        <p className="text-slate-600 mb-6 leading-relaxed">
          This chat interface is currently not public or doesn't exist. Please check back later or contact the owner.
        </p>
        <div className="text-sm text-slate-500 mb-6">
          If you believe this is an error, please verify the URL or contact support.
        </div>
        <div className="space-y-4">
          <Link href="/">
            <Button className="w-full">
              Go to Homepage
            </Button>
          </Link>
          <div className="flex items-center justify-center space-x-2 text-sm text-slate-500">
            <img src="/axie-logo.webp" alt="Axie Studio" className="w-4 h-4" />
            <span>Powered by Axie Studio</span>
          </div>
        </div>
      </div>
    </div>
  );
}