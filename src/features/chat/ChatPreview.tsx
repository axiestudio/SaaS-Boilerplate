'use client';

import { Send, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type ChatConfig = {
  brandName: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  welcomeMessage: string;
  placeholderText: string;
};

export const ChatPreview = ({ config }: { config: ChatConfig }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: '', isUser: false }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Update welcome message when config changes
  useEffect(() => {
    setMessages([{
      id: 1,
      text: config.welcomeMessage || 'Hello! How can I help you today?',
      isUser: false
    }]);
  }, [config.welcomeMessage]);

  const sendMessage = () => {
    if (!inputValue.trim()) return;
    
    setMessages(prev => [...prev, { 
      id: prev.length + 1, 
      text: inputValue, 
      isUser: true 
    }]);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate bot response with realistic delay
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        id: prev.length + 1, 
        text: 'This is a preview response from your chat interface. The actual responses will come from your Axie Studio flow.', 
        isUser: false 
      }]);
    }, 1500);
  };

  return (
    <div className="border rounded-2xl overflow-hidden bg-white max-w-md mx-auto shadow-xl">
      {/* Enhanced Header */}
      <div 
        className="relative overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${config.primaryColor || '#3B82F6'} 0%, ${config.primaryColor || '#3B82F6'}dd 100%)`,
        }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        </div>
        
        <div className="relative p-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              {config.logoUrl ? (
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm p-1.5 border border-white/30">
                  <img 
                    src={config.logoUrl} 
                    alt="Logo" 
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <Image src="/axie-logo.webp" alt="Axie Studio" width={20} height={20} />
                </div>
              )}
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div className="text-white">
              <h3 className="font-semibold text-sm">{config.brandName || 'Your Brand'}</h3>
              <div className="flex items-center space-x-2 text-xs opacity-90">
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Online</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>AI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-64 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50 to-white">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-end space-x-2 max-w-[80%] ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
              {!message.isUser && (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Image src="/axie-logo.webp" alt="AI" width={12} height={12} />
                </div>
              )}
              <div
                className={`px-3 py-2 rounded-xl text-xs shadow-sm ${
                  message.isUser
                    ? 'text-white rounded-br-sm'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'
                }`}
                style={{
                  backgroundColor: message.isUser 
                    ? config.primaryColor || '#3B82F6'
                    : 'white'
                }}
              >
                {message.text}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-end space-x-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Image src="/axie-logo.webp" alt="AI" width={12} height={12} />
              </div>
              <div className="bg-white border border-slate-200 px-3 py-2 rounded-xl rounded-bl-sm shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Input */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={config.placeholderText || 'Type your message...'}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="text-xs border-slate-200 focus:border-blue-500 rounded-lg transition-colors"
              disabled={!config.brandName}
            />
          </div>
          <Button 
            onClick={sendMessage}
            size="sm"
            className="rounded-lg px-3 transition-all duration-200 hover:scale-105"
            style={{ backgroundColor: config.primaryColor || '#3B82F6' }}
            disabled={!inputValue.trim() || !config.brandName}
          >
            <Send className="h-3 w-3" />
          </Button>
        </div>
        <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
          <div className="flex items-center space-x-1">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
            <span>Live Preview</span>
          </div>
          <div className="flex items-center space-x-1">
            <Image src="/axie-logo.webp" alt="Axie Studio" width={12} height={12} />
            <span>Axie Studio</span>
          </div>
        </div>
      </div>
    </div>
  );
};