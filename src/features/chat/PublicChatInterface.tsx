'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, Minimize2, Maximize2, X, Shield, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { generateMockResponse } from './DemoMockAPI';
import { makeApiCall, detectApiType } from '@/utils/apiAdapters';

type ChatMessage = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

type ChatConfig = {
  id: number;
  name: string;
  brandName: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  textColor: string;
  botMessageColor: string;
  userMessageColor: string;
  welcomeMessage: string;
  placeholderText: string;
  apiEndpoint: string;
  apiKey: string;
  isPublic: boolean;
};

export const PublicChatInterface = ({ slug }: { slug: string }) => {
  const [config, setConfig] = useState<ChatConfig | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        console.log('🔍 Fetching config for slug:', slug);
        const response = await fetch(`/api/chat-interfaces/public/${slug}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('❌ Failed to fetch config:', errorData);
          setError(errorData.message || 'Chat interface not found');
          return;
        }

        const data = await response.json();
        console.log('✅ Config loaded:', data);
        setConfig(data);

        // Initialize with welcome message
        if (data.welcomeMessage) {
          setMessages([{
            id: 'welcome',
            text: data.welcomeMessage,
            isUser: false,
            timestamp: new Date(),
          }]);
        }
      } catch (error) {
        console.error('❌ Error fetching config:', error);
        setError('Failed to load chat interface');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, [slug]);

  const sendMessage = async () => {
    if (!inputValue.trim() || !config || isSending) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: inputValue.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsSending(true);
    setIsTyping(true);

    try {
      let botResponse: string;

      // Use mock API for demo
      if (slug === 'demo') {
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        botResponse = generateMockResponse(userMessage.text);
      } else {
        // Real API call for non-demo interfaces
        const apiType = detectApiType(config.apiEndpoint);
        let authMethod: 'header' | 'bearer' = 'header';
        
        if (apiType === 'langflow' || apiType === 'openai' || apiType === 'cohere') {
          authMethod = 'bearer';
        }

        const apiConfig = {
          endpoint: config.apiEndpoint,
          apiKey: config.apiKey,
          authMethod,
          requestFormat: apiType as any,
        };

        const result = await makeApiCall({
          message: userMessage.text,
          sessionId,
          config: apiConfig,
        });

        if (result.success && result.message) {
          botResponse = result.message;
        } else {
          botResponse = `I apologize, but I'm experiencing technical difficulties right now. Please try again in a moment. (Error: ${result.error || 'Unknown error'})`;
        }
      }

      setIsTyping(false);

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        text: botResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);

      // Save messages to database
      try {
        await fetch('/api/chat-messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chatInterfaceId: config.id,
            sessionId,
            messages: [
              { text: userMessage.text, isUser: true },
              { text: botResponse, isUser: false },
            ],
          }),
        });
      } catch (saveError) {
        console.warn('Failed to save messages:', saveError);
      }

    } catch (error) {
      setIsTyping(false);
      console.error('Error sending message:', error);
      
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        text: 'I apologize, but I encountered an error while processing your message. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <MessageCircle className="h-8 w-8 text-white animate-pulse" />
          </div>
          <p className="text-lg font-medium text-gray-600">Loading chat interface...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <X className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Chat Unavailable</h2>
          <p className="text-gray-600 mb-6">{error || 'This chat interface is currently unavailable.'}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4"
      style={{ fontFamily: config.fontFamily }}
    >
      {/* Chat Container */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          scale: 1,
          height: isMinimized ? 'auto' : 'auto'
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50 ${
          isMinimized ? 'h-auto' : 'h-[600px]'
        }`}
      >
        {/* Enhanced Header */}
        <motion.div
          className="relative overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, ${config.primaryColor} 0%, ${config.primaryColor}dd 100%)`,
          }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
          </div>
          
          <div className="relative px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Logo/Avatar */}
                <div className="relative flex-shrink-0">
                  {config.logoUrl ? (
                    <div className="relative">
                      <img 
                        src={config.logoUrl} 
                        alt={`${config.brandName} logo`}
                        className="w-12 h-12 rounded-2xl object-cover border-2 border-white/30 shadow-lg"
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center border-2 border-white/30 shadow-lg backdrop-blur-sm">
                      <MessageCircle className="h-6 w-6 text-white" />
                    </div>
                  )}
                  
                  {/* Online Status Indicator */}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm">
                    <div className="w-full h-full bg-green-400 rounded-full animate-pulse" />
                  </div>
                </div>

                {/* Brand Info */}
                <div className="flex-1 min-w-0">
                  <h1 className="font-bold text-lg text-white truncate">
                    {config.brandName}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-sm" />
                    <span className="text-sm text-white/90 font-medium">
                      Available now
                    </span>
                  </div>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="w-8 h-8 p-0 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                >
                  {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Subtle bottom border */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </motion.div>

        {/* Chat Messages Area */}
        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 overflow-hidden"
            >
              <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50/30 to-white/50 backdrop-blur-sm">
                <AnimatePresence initial={false}>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-end gap-3 max-w-[85%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                        {/* Avatar for bot messages */}
                        {!message.isUser && (
                          <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm"
                               style={{ backgroundColor: config.primaryColor }}>
                            {config.logoUrl ? (
                              <img 
                                src={config.logoUrl} 
                                alt="Bot"
                                className="w-6 h-6 rounded-full object-cover"
                              />
                            ) : (
                              <MessageCircle className="h-4 w-4 text-white" />
                            )}
                          </div>
                        )}

                        {/* Message Bubble */}
                        <div
                          className={`px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                            message.isUser 
                              ? 'rounded-br-md' 
                              : 'rounded-bl-md'
                          }`}
                          style={{
                            backgroundColor: message.isUser
                              ? config.userMessageColor
                              : config.botMessageColor,
                            color: message.isUser
                              ? '#FFFFFF'
                              : config.textColor,
                            border: message.isUser 
                              ? 'none' 
                              : '1px solid rgba(0,0,0,0.05)'
                          }}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                            {message.text}
                          </p>
                          <div className={`text-xs mt-2 opacity-70 ${
                            message.isUser ? 'text-white/70' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing Indicator */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-end gap-3 max-w-[85%]">
                        <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm"
                             style={{ backgroundColor: config.primaryColor }}>
                          {config.logoUrl ? (
                            <img 
                              src={config.logoUrl} 
                              alt="Bot"
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          ) : (
                            <MessageCircle className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <div 
                          className="px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border"
                          style={{
                            backgroundColor: config.botMessageColor,
                            borderColor: 'rgba(0,0,0,0.05)'
                          }}
                        >
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Input Area */}
        {!isMinimized && (
          <div className="border-t border-gray-100 bg-white/80 backdrop-blur-sm p-6">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={config.placeholderText}
                  disabled={isSending}
                  className="h-12 text-base border-2 border-gray-200 rounded-2xl focus:border-primary/50 focus:ring-0 transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none"
                  style={{ color: config.textColor }}
                  maxLength={500}
                />
                
                {/* Character Counter */}
                <div className="flex justify-between items-center mt-2 px-1">
                  <div className="text-xs text-gray-400">
                    {inputValue.length}/500
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span>Connected</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      <span>Secure</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Send Button */}
              <Button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isSending}
                className="h-12 w-12 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex-shrink-0 p-0"
                style={{ 
                  background: `linear-gradient(135deg, ${config.primaryColor} 0%, ${config.primaryColor}dd 100%)`,
                  border: 'none'
                }}
              >
                <motion.div
                  animate={isSending ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 1, repeat: isSending ? Infinity : 0, ease: "linear" }}
                >
                  {isSending ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="h-5 w-5 text-white" />
                  )}
                </motion.div>
              </Button>
            </div>
          </div>
        )}

        {/* Enhanced Footer */}
        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Zap className="h-3 w-3" />
              <span>Powered by</span>
              <a 
                href="https://axiestudio.se" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
              >
                Axie Studio
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/10 via-purple-400/10 to-pink-400/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [360, 270, 180, 90, 0],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-green-400/10 via-blue-400/10 to-purple-400/10 rounded-full blur-3xl"
        />
      </div>
    </div>
  );
};