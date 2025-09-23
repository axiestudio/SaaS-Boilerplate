'use client';

import { Send, Minimize2, Maximize2, User, Bot } from 'lucide-react';
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

  // Real-time config updates
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

    // Set up polling for real-time updates every 30 seconds
    const interval = setInterval(fetchConfig, 30000);

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

      // Save messages to database
      if (config.id) {
        try {
          await fetch('/api/chat-messages', {
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Chat Unavailable</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            If you believe this is an error, please contact support.
          </p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading chat interface...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header 
        className="bg-white shadow-sm border-b transition-colors duration-300"
        style={{ 
          backgroundColor: config.primaryColor,
          borderBottomColor: `${config.primaryColor}20`
        }}
      >
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {config.logoUrl ? (
                <img 
                  src={config.logoUrl} 
                  alt={`${config.brandName} logo`}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                />
              ) : (
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-lg"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                >
                  {config.brandName.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-lg font-semibold text-white">{config.brandName}</h1>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-white/90">Online</span>
                </div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:bg-white/10 transition-colors"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      {!isMinimized && (
        <>
          {/* Messages Container */}
          <main className="flex-1 overflow-hidden">
            <div className="h-full max-w-4xl mx-auto flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 ${
                      message.isUser ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.isUser 
                        ? 'bg-gray-300 text-gray-700' 
                        : 'text-white'
                    }`}
                    style={!message.isUser ? { backgroundColor: config.primaryColor } : {}}
                    >
                      {message.isUser ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div className={`flex flex-col max-w-xs lg:max-w-md ${
                      message.isUser ? 'items-end' : 'items-start'
                    }`}>
                      <div
                        className={`px-4 py-3 rounded-2xl shadow-sm ${
                          message.isUser
                            ? 'text-white rounded-br-md'
                            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md'
                        }`}
                        style={message.isUser ? { backgroundColor: config.primaryColor } : {}}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                      </div>
                      <span className="text-xs text-gray-500 mt-1 px-1">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isLoading && (
                  <div className="flex items-start space-x-3">
                    <div 
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: config.primaryColor }}
                    >
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
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
          </main>

          {/* Input Area */}
          <footer className="bg-white border-t border-gray-200">
            <div className="max-w-4xl mx-auto p-4">
              <div className="flex items-end space-x-3">
                <div className="flex-1">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={config.placeholderText}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    className="resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                    maxLength={500}
                  />
                </div>
                <Button 
                  onClick={sendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  size="lg"
                  className="rounded-lg px-6 transition-all duration-200 hover:shadow-md"
                  style={{ backgroundColor: config.primaryColor }}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Footer Attribution */}
              <div className="text-center mt-3">
                <a 
                  href="https://axiestudio.se" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Powered by <span className="font-medium">Axie Studio</span>
                </a>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};