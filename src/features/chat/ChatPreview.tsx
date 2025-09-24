'use client';

import { Send, Sparkles, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type ChatConfig = {
  brandName: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily?: string;
  textColor?: string;
  botMessageColor?: string;
  userMessageColor?: string;
  welcomeMessage: string;
  placeholderText: string;
};

export const ChatPreview = ({ config }: { config: ChatConfig }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: '', isUser: false }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Update welcome message when config changes
  useEffect(() => {
    setMessages([{
      id: 1,
      text: config.welcomeMessage || 'Hello! How can I help you today?',
      isUser: false
    }]);
  }, [config.welcomeMessage]);

  // Show visual feedback when config changes
  useEffect(() => {
    setIsUpdating(true);
    const timer = setTimeout(() => setIsUpdating(false), 300);
    return () => clearTimeout(timer);
  }, [config]);

  const sendMessage = () => {
    if (!inputValue.trim()) return;
    
    setMessages(prev => [...prev, { 
      id: prev.length + 1, 
      text: inputValue, 
      isUser: true 
    }]);
    setInputValue('');
    
    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: prev.length + 1, 
        text: 'This is a preview response from your chat interface. Your actual responses will come from your Axie Studio flow.', 
        isUser: false 
      }]);
    }, 1000);
  };

  return (
    <div className="relative h-full flex flex-col">
      {/* Preview Label */}
      <div className="absolute -top-3 left-4 z-10">
        <div className="inline-flex items-center gap-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
          <Sparkles className="h-3 w-3" />
          Live Preview
        </div>
      </div>

      <div
        className={`border-2 rounded-2xl overflow-hidden bg-white shadow-2xl transition-all duration-500 ${
          isUpdating ? 'ring-4 ring-primary/30 scale-[1.02]' : 'hover:shadow-3xl'
        } h-full flex flex-col`}
        style={{
          fontFamily: config.fontFamily || 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          color: config.textColor || '#1F2937'
        }}
      >
        {/* Enhanced Header */}
        <div
          className="p-4 text-white relative overflow-hidden flex-shrink-0"
          style={{ 
            background: `linear-gradient(135deg, ${config.primaryColor || '#3B82F6'} 0%, ${config.secondaryColor || '#F3F4F6'} 100%)` 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
          <div className="relative flex items-center gap-4">
            {config.logoUrl ? (
              <div className="relative">
                <img 
                  src={config.logoUrl} 
                  alt="Logo" 
                  fontSize: '16px',
                />
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  border: '2px solid rgba(255, 255, 255, 0.3)'
            ) : (
                  <MessageSquare size={20} />
                <MessageSquare className="h-6 w-6 text-white" />
                  width: '40px',
                  height: '40px',
            <div>
              <h3 className="font-bold text-lg">{config.brandName || 'Your Brand'}</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                <p className="text-sm opacity-90 font-medium">Online • Ready to help</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Messages Area */}
        <div className="h-80 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50/50 to-white">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div
                className={`max-w-xs px-4 py-3 rounded-2xl text-sm font-medium shadow-lg transition-all duration-200 hover:shadow-xl ${
                  message.isUser 
                    ? 'rounded-br-md' 
                    : 'rounded-bl-md'
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                    : (config.botMessageColor || '#F9FAFB'),
                  color: message.isUser
                    ? 'white'
                    : (config.textColor || '#1F2937'),
                  boxShadow: message.isUser
                    ? `0 4px 12px ${config.userMessageColor || config.primaryColor || '#3B82F6'}25`
                  margin: '0 0 2px 0',
                  textShadow: '0 1px 3px rgba(0, 0, 0, 0.2)'
              >
                {message.text}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
      <div className="p-4 border-t-2 border-gray-100 bg-white flex-shrink-0">
        <div className="flex gap-2">
            </div>
          ))}
        </div>

        {/* Enhanced Input Area */}
        <div className="p-6 border-t-2 border-gray-100 bg-white">
          <div className="flex gap-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={config.placeholderText || 'Type your message...'}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 h-12 text-base border-2 rounded-xl focus:border-primary/50 transition-all duration-200"
            className="flex-1 h-10 text-sm border-2 rounded-lg focus:border-primary/50 transition-all duration-200"
            />
            <Button 
              onClick={sendMessage}
              size="lg"
            className="h-10 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                background: `linear-gradient(135deg, ${config.primaryColor || '#3B82F6'} 0%, ${config.primaryColor || '#3B82F6'}dd 100%)` 
              }}
              disabled={!inputValue.trim() || !config.brandName}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Enhanced Status Indicator */}
          <div className="text-xs text-gray-500 mt-3 text-center flex items-center justify-center gap-2">
        <div className="text-xs text-gray-500 mt-2 text-center flex items-center justify-center gap-2">
              isUpdating 
                ? 'bg-blue-500 animate-ping' 
                : 'bg-green-500 animate-pulse shadow-lg shadow-green-500/50'
            }`}></div>
            <span className="font-medium">
              {isUpdating ? 'Updating preview...' : 'Live Preview • Changes update instantly'}
            </span>
          </div>
        </div>
      </div>
    </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50/50 to-white min-h-0">
};