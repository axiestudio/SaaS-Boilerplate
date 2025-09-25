'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageCircle, Home, Search, ArrowLeft, Sparkles, AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function ChatNotFound() {
  // Fallback translations for public chat not-found page
  const t = (key: string) => {
    const fallbackTranslations: Record<string, string> = {
      'title': 'Chat Interface Not Found',
      'description': 'The chat interface you\'re looking for is currently unavailable or doesn\'t exist.',
      'possible_reasons': 'Possible reasons:',
      'reason_private': 'The chat interface is currently set to private',
      'reason_incorrect_url': 'The URL might be incorrect or outdated',
      'reason_disabled': 'The interface may have been temporarily disabled',
      'try_demo': 'Try Our Demo Chat',
      'create_own': 'Create Your Own Chat Interface',
    };
    return fallbackTranslations[key] || key;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/10 via-purple-400/10 to-pink-400/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-green-400/10 via-blue-400/10 to-purple-400/10 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative max-w-2xl w-full"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-12 text-center overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
          
          {/* Content */}
          <div className="relative">
            {/* Icon with Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.4 }}
              className="relative mx-auto mb-8"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-500/25 mx-auto">
                <AlertTriangle className="h-12 w-12 text-white" />
              </div>
              {/* Glow Effect */}
              <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl blur-xl opacity-30 animate-pulse mx-auto" />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent"
            >
              {t('title')}
            </motion.h1>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="space-y-4 mb-10"
            >
              <p className="text-xl text-gray-600 leading-relaxed">
                {t('description')}
              </p>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <MessageCircle className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-blue-900 mb-2">{t('possible_reasons')}</h3>
                    <ul className="text-blue-800 text-sm space-y-1">
                      <li>• {t('reason_private')}</li>
                      <li>• {t('reason_incorrect_url')}</li>
                      <li>• {t('reason_disabled')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/chat/demo">
                  <Button 
                    size="lg"
                    className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl transition-all duration-300 group"
                  >
                    <Sparkles className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-200" />
                    {t('try_demo')}
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="px-8 py-4 text-lg font-semibold border-2 hover:bg-gray-50 transition-all duration-300 group"
                  >
                    <Home className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                    Back to Homepage
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Help Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="mt-12 pt-8 border-t border-gray-200"
            >
              <div className="flex items-center justify-center gap-2 text-gray-500 mb-4">
                <Search className="h-4 w-4" />
                <span className="text-sm font-medium">Need help?</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                If you believe this is an error, please contact the chat interface owner or our support team.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center text-sm">
                <Link 
                  href="mailto:support@axiestudio.se" 
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200"
                >
                  Contact Support
                </Link>
                <span className="hidden sm:inline text-gray-300">•</span>
                <Link 
                  href="/sign-up" 
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200"
                >
                  {t('create_own')}
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-6 right-6 w-16 h-16 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl" />
          <div className="absolute bottom-6 left-6 w-12 h-12 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-lg" />
        </div>
      </motion.div>
    </div>
  );
}