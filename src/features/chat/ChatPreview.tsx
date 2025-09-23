'use client';

import { Send } from 'lucide-react';
import { useState } from 'react';

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
    
    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: prev.length + 1, 
        text: 'This is a preview response from your chat interface.', 
        isUser: false 
      }]);
    }, 1000);
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white max-w-md mx-auto shadow-lg">
      {/* Header */}
      <div 
        className="p-4 text-white"
        style={{ backgroundColor: config.primaryColor || '#3B82F6' }}
      >
        <div className="flex items-center gap-3">
          {config.logoUrl && (
            <img 
              src={config.logoUrl} 
              alt="Logo" 
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
          <div>
            <h3 className="font-semibold">{config.brandName || 'Your Brand'}</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <p className="text-sm opacity-90">Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-64 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                message.isUser
                  ? 'text-white'
                  : 'text-gray-800'
              }`}
              style={{
                backgroundColor: message.isUser 
                  ? config.primaryColor || '#3B82F6'
                  : config.secondaryColor || '#F3F4F6'
              }}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={config.placeholderText || 'Type your message...'}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1"
            disabled={!config.brandName} // Disable if no brand name (incomplete config)
          />
          <Button 
            onClick={sendMessage}
            size="sm"
            style={{ backgroundColor: config.primaryColor || '#3B82F6' }}
            disabled={!inputValue.trim() || !config.brandName}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-xs text-gray-500 mt-2 text-center">
          Live Preview - Changes update in real-time
        </div>
      </div>
    </div>
  );
};