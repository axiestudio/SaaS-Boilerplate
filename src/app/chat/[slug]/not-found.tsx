'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageCircle, Home, Search, ArrowLeft, Sparkles, AlertTriangle, ExternalLink, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function ChatNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Gradient Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/15 via-purple-400/15 to-pink-400/15 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.3, 1, 1.3],
            rotate: [360, 180, 0],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-green-400/15 via-blue-400/15 to-purple-400/15 rounded-full blur-3xl"
        />
        
        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.sin(i) * 10, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
            className={`absolute w-2 h-2 bg-gradient-to-r from-blue-500/40 to-purple-500/40 rounded-full blur-sm`}
            style={{
              top: `${20 + i * 10}%`,
              left: `${10 + i * 15}%`,
            }}
          />
        ))}

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative max-w-4xl w-full"
      >
        <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 p-12 text-center overflow-hidden relative">
          {/* Enhanced Background Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
          
          {/* Animated Border */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 animate-pulse" />
          
          {/* Content */}
          <div className="relative">
            {/* Enhanced Icon with Multiple Layers */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.4 }}
              className="relative mx-auto mb-8"
            >
              <div className="relative">
                {/* Main Icon Container */}
                <div className="w-28 h-28 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-500/30 mx-auto relative overflow-hidden">
                  <AlertTriangle className="h-14 w-14 text-white relative z-10" />
                  {/* Inner Glow */}
                  <div className="absolute inset-2 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
                </div>
                
                {/* Outer Glow Effects */}
                <div className="absolute inset-0 w-28 h-28 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl blur-2xl opacity-40 animate-pulse mx-auto" />
                <div className="absolute inset-0 w-28 h-28 bg-gradient-to-br from-pink-500 to-orange-500 rounded-3xl blur-3xl opacity-20 mx-auto" />
                
                {/* Floating Ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 w-32 h-32 border-2 border-dashed border-orange-300/50 rounded-full mx-auto"
                  style={{ top: '-8px', left: '-8px' }}
                />
              </div>
            </motion.div>

            {/* Enhanced Title with Gradient */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent leading-tight"
            >
              Chat Interface Not Found
            </motion.h1>

            {/* Enhanced Description */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="space-y-6 mb-12"
            >
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-medium">
                The chat interface you're looking for is currently unavailable or doesn't exist.
              </p>
              
              {/* Enhanced Info Card */}
              <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-200/50 shadow-lg">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="font-bold text-blue-900 mb-4 text-lg">Possible reasons:</h3>
                    <ul className="text-blue-800 space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <span>The chat interface is currently set to private</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <span>The URL might be incorrect or outdated</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <span>The interface may have been temporarily disabled</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <Link href="/chat/demo">
                  <Button 
                    size="lg"
                    className="px-10 py-4 text-lg font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 shadow-2xl hover:shadow-3xl transition-all duration-300 group relative overflow-hidden rounded-xl"
                  >
                    {/* Button Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-xl group-hover:blur-2xl transition-all duration-300" />
                    <div className="relative flex items-center">
                      <Sparkles className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform duration-200" />
                      Try Our Demo Chat
                    </div>
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="px-10 py-4 text-lg font-bold border-2 border-gray-300 hover:border-gray-400 bg-white/80 backdrop-blur-sm hover:bg-gray-50 transition-all duration-300 group rounded-xl shadow-lg hover:shadow-xl"
                  >
                    <Home className="h-6 w-6 mr-3 group-hover:-translate-x-1 transition-transform duration-200" />
                    Back to Homepage
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Enhanced Help Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="pt-8 border-t-2 border-gray-200/50"
            >
              <div className="flex items-center justify-center gap-3 text-gray-500 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg flex items-center justify-center">
                  <Search className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-semibold">Need help?</span>
              </div>
              
              <p className="text-gray-600 mb-6 text-lg leading-relaxed max-w-2xl mx-auto">
                If you believe this is an error, please contact the chat interface owner or our support team for assistance.
              </p>
              
              {/* Enhanced Contact Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <a 
                    href="mailto:support@axiestudio.se" 
                    className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200/50 rounded-xl hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300/50 transition-all duration-300 group"
                  >
                    <Mail className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-semibold text-blue-700">Contact Support</span>
                  </a>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link 
                    href="/sign-up" 
                    className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200/50 rounded-xl hover:from-green-100 hover:to-emerald-100 hover:border-green-300/50 transition-all duration-300 group"
                  >
                    <ExternalLink className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-semibold text-green-700">Create Your Own</span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Enhanced Decorative Elements */}
          <div className="absolute top-8 right-8 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-8 left-8 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute top-1/2 left-8 w-3 h-3 bg-yellow-400/60 rounded-full animate-bounce" />
          <div className="absolute top-1/3 right-12 w-2 h-2 bg-green-400/60 rounded-full animate-ping" />
          
          {/* Shine Effect */}
          <motion.div
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 2,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
          />
        </div>
      </motion.div>

      {/* Enhanced Floating Action Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="fixed bottom-8 right-8"
      >
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
        >
          <Link href="/chat/demo">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-300 group">
              <MessageCircle className="h-8 w-8 text-white group-hover:scale-110 transition-transform duration-200" />
              {/* Pulse Ring */}
              <div className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping" />
            </div>
          </Link>
        </motion.div>
      </motion.div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}