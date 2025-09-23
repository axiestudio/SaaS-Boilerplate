'use client';

import { Send, Minimize2, Maximize2, MessageCircle, Sparkles } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

type ChatConfig = {
  id?: number;
  name: string;
  brandName: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  welcomeMessage: string;
  placeholderText: string;
  apiEndpoint: string;
  apiKey: string;
  isActive: boolean;
};

export const PublicChatInterface = ({ slug }: { slug: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<ChatConfig | null>(null);
  const [sessionId] = useState(() => Math.random().toString(36).substring(2, 15));
  const [isMinimized, setIsMinimized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Real-time config updates with polling
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(`/api/chat-interfaces/public/${slug}`, {
          cache: 'no-store',
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message || 'This chat interface is currently unavailable.');
          return;
        }

        const configData = await response.json();
        
        if (!configData.isPublic) {
          setError('This chat interface is currently not public. Please check back later.');
          return;
        }

        setConfig(configData);
        setError(null);
      } catch (error) {
        console.error('Error fetching config:', error);
        setError('Failed to load chat interface. Please try again later.');
      }
    };

    fetchConfig();
    const interval = setInterval(fetchConfig, 10000); // Poll every 10 seconds for real-time updates
    return () => clearInterval(interval);
  }, [slug]);

  useEffect(() => {
    if (config) {
      setMessages([{
        id: '1',
        text: config.welcomeMessage,
        isUser: false,
        timestamp: new Date(),
      }]);
    }
  }, [config?.welcomeMessage]);

  const sendMessage = async () => {
    if (!inputValue.trim() || !config || isLoading) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await fetch(config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey,
        },
        body: JSON.stringify({
          output_type: 'chat',
          input_type: 'chat',
          input_value: inputValue,
          session_id: sessionId,
        }),
      });

      const data = await response.json();
      
      // Simulate typing delay for better UX
      setTimeout(() => {
        setIsTyping(false);
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.output || 'I apologize, but I encountered an error processing your request. Please try again.',
          isUser: false,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, botMessage]);

        // Save messages to database
        if (config.id) {
          try {
            fetch('/api/chat-messages', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chatInterfaceId: config.id,
                sessionId,
                messages: [
                  { text: userMessage.text, isUser: true },
                  { text: botMessage.text, isUser: false }
                ]
              })
            });
          } catch (saveError) {
            console.error('Failed to save messages:', saveError);
          }
        }
      }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds

    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I\'m sorry, but I\'m having trouble connecting right now. Please try again in a moment.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-2xl max-w-md mx-4 border border-slate-200">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-3">Chat Interface Unavailable</h1>
          <p className="text-slate-600 mb-6 leading-relaxed">{error}</p>
          <div className="flex items-center justify-center space-x-2 text-sm text-slate-500">
            <Image src="/axie-logo.webp" alt="Axie Studio" width={16} height={16} />
            <span>Powered by Axie Studio</span>
          </div>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
              <Image src="/axie-logo.webp" alt="Axie Studio" width={24} height={24} />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full w-32 mx-auto animate-pulse"></div>
            <p className="text-slate-600 font-medium">Loading your chat experience...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Enhanced Header with Axie Studio Branding */}
      <div 
        className="relative overflow-hidden shadow-lg transition-all duration-300"
        style={{ 
          background: `linear-gradient(135deg, ${config.primaryColor} 0%, ${config.primaryColor}dd 100%)`,
        }}
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
        </div>
        
        <div className="relative p-6">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center space-x-4">
              {/* Enhanced Logo Display */}
              <div className="relative">
                {config.logoUrl ? (
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm p-2 border border-white/30">
                    <img 
                      src={config.logoUrl} 
                      alt="Logo" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                    <Image src="/axie-logo.webp" alt="Axie Studio" width={24} height={24} />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              
              <div className="text-white">
                <h1 className="text-xl font-bold tracking-tight">{config.brandName}</h1>
                <div className="flex items-center space-x-2 text-sm opacity-90">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Online</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>AI-Powered</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-2 text-white/80 text-sm">
                <Image src="/axie-logo.webp" alt="Axie Studio" width={16} height={16} />
                <span>Powered by Axie Studio</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20 transition-colors"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Enhanced Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
                >
                  <div className={`flex items-end space-x-3 max-w-xs lg:max-w-md ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {/* Avatar */}
                    {!message.isUser && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <Image src="/axie-logo.webp" alt="AI" width={16} height={16} />
                      </div>
                    )}
                    
                    {/* Message Bubble */}
                    <div
                      className={`px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                        message.isUser
                          ? 'text-white rounded-br-sm'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'
                      }`}
                      style={{
                        backgroundColor: message.isUser ? config.primaryColor : 'white'
                      }}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                      <p className={`text-xs mt-2 ${message.isUser ? 'text-white/70' : 'text-slate-500'}`}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Enhanced Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-end space-x-3 max-w-xs">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Image src="/axie-logo.webp" alt="AI" width={16} height={16} />
                    </div>
                    <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Enhanced Input Area */}
          <div className="bg-white border-t border-slate-200 p-6 shadow-lg">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-end space-x-4">
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={config.placeholderText}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    className="resize-none border-2 border-slate-200 focus:border-blue-500 rounded-xl px-4 py-3 text-sm transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-md"
                    maxLength={500}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-slate-400">
                    {inputValue.length}/500
                  </div>
                </div>
                <Button 
                  onClick={sendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  size="lg"
                  className="rounded-xl px-6 py-3 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none"
                  style={{ backgroundColor: config.primaryColor }}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {/* Enhanced Footer */}
              <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Secure & Private</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-3 h-3" />
                    <span>AI-Enhanced</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Image src="/axie-logo.webp" alt="Axie Studio" width={14} height={14} />
                  <span>Powered by Axie Studio</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};