'use client';

import { Send, Minimize2, Maximize2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/chat-interfaces/public/${slug}`);
        
        // Mock data for demonstration
        const mockConfig: ChatConfig = {
          id: 1,
          name: 'Customer Support Chat',
          brandName: 'TechCorp Support',
          logoUrl: '/axie-logo.webp',
          primaryColor: '#3B82F6',
          secondaryColor: '#F3F4F6',
          welcomeMessage: 'Hello! I\'m here to help you with any questions about our products and services. How can I assist you today?',
          placeholderText: 'Type your message here...',
          apiEndpoint: 'https://flow.axiestudio.se/api/v1/run/f367b850-4b93-47a2-9cc2-b6562a674ba4',
          apiKey: 'your-api-key',
          isActive: true,
        };

        if (!mockConfig.isActive) {
          setError('This chat interface is currently unavailable.');
          return;
        }

        setConfig(mockConfig);
      } catch (error) {
        console.error('Error fetching config:', error);
        setError('Failed to load chat interface.');
      }
    };

    fetchConfig();
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
  }, [config]);

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
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.output || 'I apologize, but I encountered an error processing your request. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);

      // TODO: Save messages to database
      // await fetch('/api/chat-messages', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     chatInterfaceId: config.id,
      //     sessionId,
      //     messages: [userMessage, botMessage]
      //   })
      // });

    } catch (error) {
      console.error('Error sending message:', error);
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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Chat Unavailable</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat interface...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div 
        className="p-4 text-white shadow-lg relative"
        style={{ backgroundColor: config.primaryColor }}
      >
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            {config.logoUrl && (
              <img 
                src={config.logoUrl} 
                alt="Logo" 
                className="w-10 h-10 rounded-full object-cover bg-white/20 p-1"
              />
            )}
            <div>
              <h1 className="text-xl font-semibold">{config.brandName}</h1>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <p className="text-sm opacity-90">Online</p>
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white hover:bg-white/20"
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                      message.isUser
                        ? 'text-white rounded-br-sm'
                        : 'text-gray-800 border rounded-bl-sm bg-white'
                    }`}
                    style={{
                      backgroundColor: message.isUser 
                        ? config.primaryColor
                        : 'white'
                    }}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                    <p className={`text-xs mt-2 ${message.isUser ? 'opacity-70' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={config.placeholderText}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    className="resize-none border-2 focus:border-blue-500 rounded-xl"
                    maxLength={500}
                  />
                </div>
                <Button 
                  onClick={sendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  size="lg"
                  className="rounded-xl px-6"
                  style={{ backgroundColor: config.primaryColor }}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-xs text-gray-500 mt-2 text-center">
                Powered by Axie Studio
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};