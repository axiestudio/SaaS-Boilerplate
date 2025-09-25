'use client';

import { Send, Minimize2, Maximize2, User, Bot, MessageCircle, Sparkles, Clock, Shield } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  contentType?: 'text' | 'code' | 'html' | 'markdown';
  metadata?: {
    language?: string;
    title?: string;
    url?: string;
  };
  hasHtml?: boolean;
  hasBookingUrl?: boolean;
  bookingUrl?: string;
};

type ChatConfig = {
  id?: number;
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
  isActive: boolean;
};

// Static error messages - no translations needed
const ERROR_MESSAGES = {
  interface_unavailable: 'This chat interface is currently unavailable.',
  interface_not_public: 'This chat interface is currently not public. Please check back later or contact the owner.',
  failed_to_load: 'Failed to load chat interface. Please try again later.',
  ai_connection_error: (error: string) => `Sorry, I'm having trouble connecting to the AI service right now. Please try again in a moment. (Error: ${error})`,
  processing_error: "I received your message but had trouble processing it. Could you please try rephrasing?",
  connection_error: (error: string) => `I'm sorry, but I'm having trouble connecting right now. Please try again in a moment. (Error: ${error})`,
  unknown_error: 'Unknown error',
  chat_unavailable: 'Chat Unavailable',
  contact_support: 'If you believe this is an error, please contact support.',
};

// AI Response Processing Function
const processAIResponse = (responseText: string) => {
  // Check for booking URLs (common patterns)
  const bookingUrlPatterns = [
    /https?:\/\/[^\s]+(?:book|calendar|appointment|schedule)[^\s]*/gi,
    /https?:\/\/calendly\.com\/[^\s]*/gi,
    /https?:\/\/cal\.com\/[^\s]*/gi,
    /https?:\/\/acuityscheduling\.com\/[^\s]*/gi,
    /https?:\/\/[^\s]*\.com\/book[^\s]*/gi,
  ];

  let hasBookingUrl = false;
  let bookingUrl = '';

  // Check for booking URLs
  for (const pattern of bookingUrlPatterns) {
    const match = responseText.match(pattern);
    if (match) {
      hasBookingUrl = true;
      bookingUrl = match[0];
      break;
    }
  }

  // Check if response contains HTML
  let hasHtml = /<[^>]+>/g.test(responseText);

  // Process the text for better display
  let processedText = responseText;

  // If it has HTML, we'll render it as HTML
  if (hasHtml) {
    // Clean up common HTML issues
    processedText = responseText
      .replace(/&nbsp;/g, ' ')
      .replace(/&/g, '&')
      .replace(/</g, '<')
      .replace(/>/g, '>');
  } else {
    // For plain text, convert URLs to clickable links
    processedText = responseText.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: underline; font-weight: 600; transition: color 0.2s;" onmouseover="this.style.color=\'#2563eb\'" onmouseout="this.style.color=\'#3b82f6\'">$1</a>'
    );

    // If we found URLs, mark as having HTML
    if (processedText !== responseText) {
      hasHtml = true;
    }
  }

  return {
    text: processedText,
    hasHtml,
    hasBookingUrl,
    bookingUrl,
  };
};

// Enhanced Message Content Renderer
const MessageContent = ({ message }: { message: Message }) => {
  const renderContent = () => {
    // Handle HTML content (including processed URLs and booking links)
    if (message.hasHtml) {
      return (
        <div>
          <div
            dangerouslySetInnerHTML={{ __html: message.text }}
            style={{
              fontSize: '15px',
              lineHeight: '1.5',
              margin: 0,
              fontWeight: '500',
              whiteSpace: 'pre-wrap'
            }}
          />
          {message.hasBookingUrl && message.bookingUrl && (
            <div style={{ marginTop: '12px' }}>
              <a
                href={message.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#3b82f6';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3)';
                }}
              >
                📅 Book Appointment
              </a>
            </div>
          )}
        </div>
      );
    }

    switch (message.contentType) {
      case 'code':
        return (
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            borderRadius: '12px',
            padding: '16px',
            margin: '8px 0',
            overflow: 'auto',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {message.metadata?.title && (
              <div style={{
                color: '#94a3b8',
                fontSize: '12px',
                fontWeight: '600',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>📄</span>
                {message.metadata.title}
                {message.metadata.language && (
                  <span style={{
                    background: '#334155',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '10px'
                  }}>
                    {message.metadata.language}
                  </span>
                )}
              </div>
            )}
            <pre style={{
              color: '#e2e8f0',
              fontSize: '14px',
              fontFamily: 'Monaco, Consolas, "Courier New", monospace',
              margin: 0,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              <code>{message.text}</code>
            </pre>
          </div>
        );

      case 'html':
        return (
          <div style={{
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px',
            margin: '8px 0',
            background: '#f8fafc'
          }}>
            {message.metadata?.title && (
              <div style={{
                color: '#64748b',
                fontSize: '12px',
                fontWeight: '600',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>🌐</span>
                {message.metadata.title}
                {message.metadata.url && (
                  <a
                    href={message.metadata.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#3b82f6',
                      textDecoration: 'none',
                      fontSize: '10px'
                    }}
                  >
                    View Source
                  </a>
                )}
              </div>
            )}
            <div
              dangerouslySetInnerHTML={{ __html: message.text }}
              style={{
                fontSize: '14px',
                lineHeight: '1.6'
              }}
            />
          </div>
        );

      case 'markdown':
        // Simple markdown-like rendering for basic formatting
        const renderMarkdown = (text: string) => {
          return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 13px;">$1</code>')
            .replace(/\n/g, '<br>');
        };

        return (
          <div
            dangerouslySetInnerHTML={{ __html: renderMarkdown(message.text) }}
            style={{
              fontSize: '15px',
              lineHeight: '1.5',
              margin: 0,
              fontWeight: '500',
              whiteSpace: 'pre-wrap'
            }}
          />
        );

      default:
        // For messages without specific content type, check if they have HTML
        if (message.hasHtml) {
          return (
            <div>
              <div
                dangerouslySetInnerHTML={{ __html: message.text }}
                style={{
                  fontSize: '15px',
                  lineHeight: '1.5',
                  margin: 0,
                  fontWeight: '500',
                  whiteSpace: 'pre-wrap'
                }}
              />
              {message.hasBookingUrl && message.bookingUrl && (
                <div style={{ marginTop: '12px' }}>
                  <a
                    href={message.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#2563eb';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = '#3b82f6';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3)';
                    }}
                  >
                    📅 Book Appointment
                  </a>
                </div>
              )}
            </div>
          );
        }

        return (
          <p style={{
            fontSize: '15px',
            lineHeight: '1.5',
            margin: 0,
            fontWeight: '500',
            whiteSpace: 'pre-wrap'
          }}>
            {message.text}
          </p>
        );
    }
  };

  return <div>{renderContent()}</div>;
};

export const PublicChatInterface = ({ slug }: { slug: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<ChatConfig | null>(null);
  const [sessionId] = useState(() => Math.random().toString(36).substring(2, 15));
  const [isMinimized, setIsMinimized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Dynamic Favicon Function
  const updateFavicon = (logoUrl?: string) => {
    if (typeof window === 'undefined') return;

    try {
      // Find existing favicon links
      let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      let appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement;

      if (logoUrl) {
        // Use user's logo as favicon
        if (favicon) {
          favicon.href = logoUrl;
        } else {
          favicon = document.createElement('link');
          favicon.rel = 'icon';
          favicon.type = 'image/x-icon';
          favicon.href = logoUrl;
          document.head.appendChild(favicon);
        }

        if (appleTouchIcon) {
          appleTouchIcon.href = logoUrl;
        } else {
          appleTouchIcon = document.createElement('link');
          appleTouchIcon.rel = 'apple-touch-icon';
          appleTouchIcon.href = logoUrl;
          document.head.appendChild(appleTouchIcon);
        }
      } else {
        // Fallback to Axie Studio favicon
        if (favicon) {
          favicon.href = '/favicon.ico';
        }
        if (appleTouchIcon) {
          appleTouchIcon.href = '/apple-touch-icon.png';
        }
      }
    } catch (error) {
      console.warn('Failed to update favicon:', error);
    }
  };

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
          setError(errorData.message || ERROR_MESSAGES.interface_unavailable);
          return;
        }

        const configData = await response.json();
        
        if (!configData.isPublic) {
          setError(ERROR_MESSAGES.interface_not_public);
          return;
        }

        setConfig(configData);
        setError(null);
      } catch (error) {
        console.error('Error fetching config:', error);
        setError(ERROR_MESSAGES.failed_to_load);
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

      // Update favicon with user's logo
      updateFavicon(config.logoUrl);
    }
  }, [config?.welcomeMessage]);

  // Online status detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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
      console.log('🚀 Starting API call to:', config.apiEndpoint);
      console.log('🔑 Using API key:', config.apiKey ? 'Present' : 'Missing');
      console.log('📝 Request body:', {
        output_type: 'chat',
        input_type: 'chat',
        input_value: inputValue,
        session_id: sessionId,
      });

      // Handle demo chat interface with mock responses
      if (config.apiKey === 'demo-api-key-12345') {
        console.log('🎭 Using demo mode with mock responses');
        
        // Import mock API function
        const { generateMockResponse } = await import('./DemoMockAPI');
        const mockResponse = generateMockResponse(inputValue);
        
        // Simulate API delay for realistic experience
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        
        const processedResponse = processAIResponse(mockResponse);
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: processedResponse.text,
          isUser: false,
          timestamp: new Date(),
          hasHtml: processedResponse.hasHtml,
          hasBookingUrl: processedResponse.hasBookingUrl,
          bookingUrl: processedResponse.bookingUrl,
        };
        
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
        return;
      }

      // 🚀 FLEXIBLE API CALL SYSTEM - WORKS WITH ANY API
      const { makeApiCall, detectApiType } = await import('@/utils/apiAdapters');

      // Auto-detect API type and configure request with correct auth method
      const apiType = detectApiType(config.apiEndpoint);

      // Determine correct authentication method based on API type
      let authMethod: 'header' | 'bearer' = 'header';
      if (apiType === 'langflow' || apiType === 'openai' || apiType === 'cohere') {
        authMethod = 'bearer';
      }

      const apiConfig = {
        endpoint: config.apiEndpoint,
        apiKey: config.apiKey,
        authMethod: authMethod,
        requestFormat: apiType as any,
      };

      console.log('🔧 Detected API type:', apiType);
      console.log('🔑 Using auth method:', authMethod);
      console.log('🚀 Making flexible API call...');

      const apiResult = await makeApiCall({
        message: inputValue,
        sessionId: sessionId,
        config: apiConfig,
      });

      if (!apiResult.success) {
        console.error('❌ API Error:', apiResult.error);

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: ERROR_MESSAGES.ai_connection_error(apiResult.error || 'Unknown'),
          isUser: false,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
        return;
      }

      console.log('✅ API Response received:', apiResult.message);

      // 🚀 OPTIMIZED: Process response immediately for faster UX
      const aiResponseText = apiResult.message || ERROR_MESSAGES.processing_error;

      console.log('📝 Processed AI response:', aiResponseText);

      // Process the AI response for HTML content and booking URLs
      const processedResponse = processAIResponse(aiResponseText);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: processedResponse.text,
        isUser: false,
        timestamp: new Date(),
        hasHtml: processedResponse.hasHtml,
        hasBookingUrl: processedResponse.hasBookingUrl,
        bookingUrl: processedResponse.bookingUrl,
      };

      // Show message immediately for faster UX
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false); // Stop loading animation immediately

      // 🚀 OPTIMIZED: Save messages in background (non-blocking)
      if (config.id) {
        // Don't await this - let it run in background for faster UX
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
        }).catch(saveError => {
          console.error('Failed to save messages:', saveError);
        });
      }

    } catch (error) {
      console.error('❌ Error sending message:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        apiEndpoint: config.apiEndpoint,
        hasApiKey: !!config.apiKey
      });

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: ERROR_MESSAGES.connection_error(error instanceof Error ? error.message : ERROR_MESSAGES.unknown_error),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{ERROR_MESSAGES.chat_unavailable}</h1>
          <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
          <p className="text-sm text-gray-500">
            {ERROR_MESSAGES.contact_support}
          </p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-3xl flex items-center justify-center shadow-lg animate-pulse">
            <MessageCircle className="h-8 w-8 text-white" />
          </div>
          <div className="space-y-3">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 font-medium">Loading chat interface...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Enhanced Global Styles */}
      <style jsx global>{`
        /* Prevent horizontal scrolling and optimize for mobile */
        html, body {
          overflow-x: hidden;
          height: 100%;
          margin: 0;
          padding: 0;
        }

        /* Enhanced animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes typingPulse {
          0%, 60%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          30% {
            transform: scale(1.2);
            opacity: 1;
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out;
        }

        .animate-slide-in-right {
          animation: slideInFromRight 0.4s ease-out;
        }

        .animate-slide-in-left {
          animation: slideInFromLeft 0.4s ease-out;
        }

        .animate-typing-pulse {
          animation: typingPulse 1.4s infinite ease-in-out;
        }

        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .mobile-optimized {
            font-size: 14px !important;
            padding: 12px 16px !important;
          }
          .mobile-header {
            padding: 12px 16px !important;
          }
          .mobile-input {
            font-size: 16px !important; /* Prevents zoom on iOS */
            min-height: 52px !important;
          }
          .mobile-send-button {
            min-height: 52px !important;
            min-width: 52px !important;
          }
        }

        /* Enhanced scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
          transition: background 0.2s ease;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: config.fontFamily || 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: config.textColor || '#1F2937',
        position: 'relative'
      }}>
        {/* Enhanced Header with Premium Design */}
        <header style={{
          background: `linear-gradient(135deg, ${config.primaryColor} 0%, ${config.secondaryColor || config.primaryColor} 100%)`,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${config.secondaryColor || config.primaryColor}20`,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Animated background elements */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)',
            pointerEvents: 'none'
          }} />
          
          <div
            className="mobile-header"
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              zIndex: 1
            }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Enhanced Logo/Avatar */}
              {config.logoUrl ? (
                <div style={{ position: 'relative' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    padding: '3px',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
                  }}>
                    <img
                      src={config.logoUrl}
                      alt={`${config.brandName} logo`}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid rgba(255, 255, 255, 0.2)'
                      }}
                    />
                  </div>
                  {/* Online indicator */}
                  <div style={{
                    position: 'absolute',
                    bottom: '2px',
                    right: '2px',
                    width: '16px',
                    height: '16px',
                    backgroundColor: isOnline ? '#10b981' : '#ef4444',
                    borderRadius: '50%',
                    border: '3px solid white',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    animation: isOnline ? 'pulse 2s infinite' : 'none'
                  }} />
                </div>
              ) : (
                <div style={{ position: 'relative' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.1))',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                    border: '2px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    <MessageCircle size={24} />
                  </div>
                  {/* Online indicator */}
                  <div style={{
                    position: 'absolute',
                    bottom: '2px',
                    right: '2px',
                    width: '16px',
                    height: '16px',
                    backgroundColor: isOnline ? '#10b981' : '#ef4444',
                    borderRadius: '50%',
                    border: '3px solid white',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    animation: isOnline ? 'pulse 2s infinite' : 'none'
                  }} />
                </div>
              )}
              
              {/* Enhanced Brand Info */}
              <div>
                <h1 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: 'white',
                  margin: '0 0 4px 0',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  letterSpacing: '-0.025em'
                }}>
                  {config.brandName}
                </h1>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: '500'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: isOnline ? '#10b981' : '#ef4444',
                    borderRadius: '50%',
                    boxShadow: isOnline ? '0 0 8px rgba(16, 185, 129, 0.6)' : '0 0 8px rgba(239, 68, 68, 0.6)',
                    animation: isOnline ? 'pulse 2s infinite' : 'none'
                  }} />
                  <span>{isOnline ? 'Online • Ready to help' : 'Reconnecting...'}</span>
                  {isLoading && (
                    <>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{
                          width: '4px',
                          height: '4px',
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          borderRadius: '50%',
                          animation: 'typingPulse 1.4s infinite ease-in-out'
                        }} />
                        <div style={{
                          width: '4px',
                          height: '4px',
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          borderRadius: '50%',
                          animation: 'typingPulse 1.4s infinite ease-in-out',
                          animationDelay: '0.2s'
                        }} />
                        <div style={{
                          width: '4px',
                          height: '4px',
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          borderRadius: '50%',
                          animation: 'typingPulse 1.4s infinite ease-in-out',
                          animationDelay: '0.4s'
                        }} />
                        <span style={{ marginLeft: '4px' }}>Typing</span>
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced Minimize Button */}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              style={{
                padding: '12px',
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
            >
              {isMinimized ? <Maximize2 size={20} /> : <Minimize2 size={20} />}
            </button>
          </div>
        </header>

        {!isMinimized && (
          <>
            {/* Enhanced Messages Container */}
            <main style={{
              flex: 1,
              overflow: 'hidden',
              background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
              display: 'flex',
              justifyContent: 'center',
              position: 'relative'
            }}>
              {/* Subtle background pattern */}
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.02) 1px, transparent 0)',
                backgroundSize: '24px 24px',
                pointerEvents: 'none'
              }} />

              <div
                className="mobile-container"
                style={{
                  height: '100%',
                  width: '100%',
                  maxWidth: '1000px',
                  display: 'flex',
                  flexDirection: 'column',
                  margin: '0 16px',
                  position: 'relative',
                  zIndex: 1
                }}>
                
                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '24px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px'
                }}>
                  {messages.map((message, index) => (
                    <div
                      key={message.id}
                      className={message.isUser ? 'animate-slide-in-right' : 'animate-slide-in-left'}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '16px',
                        flexDirection: message.isUser ? 'row-reverse' : 'row',
                        opacity: 0,
                        animation: `${message.isUser ? 'slideInFromRight' : 'slideInFromLeft'} 0.4s ease-out ${index * 0.1}s forwards`
                      }}
                    >
                      {/* Enhanced Avatar Design */}
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: message.isUser
                          ? 'linear-gradient(135deg, #64748b 0%, #475569 100%)'
                          : `linear-gradient(135deg, ${config.primaryColor} 0%, ${config.secondaryColor || config.primaryColor} 100%)`,
                        color: 'white',
                        flexShrink: 0,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        border: '3px solid rgba(255, 255, 255, 0.2)',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        {/* Subtle shine effect */}
                        <div style={{
                          position: 'absolute',
                          top: '-50%',
                          left: '-50%',
                          width: '200%',
                          height: '200%',
                          background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
                          transform: 'rotate(45deg)',
                          animation: 'shimmer 3s infinite'
                        }} />
                        {message.isUser ? <User size={20} /> : <Bot size={20} />}
                      </div>

                      {/* Enhanced Message Bubble */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: message.isUser ? 'flex-end' : 'flex-start',
                        maxWidth: '75%',
                        width: '100%'
                      }}>
                        <div
                          className="mobile-optimized"
                          style={{
                            padding: '16px 20px',
                            borderRadius: '24px',
                            boxShadow: message.isUser 
                              ? '0 4px 16px rgba(0, 0, 0, 0.1)' 
                              : '0 4px 16px rgba(0, 0, 0, 0.08)',
                            transition: 'all 0.3s ease',
                            cursor: 'default',
                            background: message.isUser
                              ? (config.userMessageColor || `linear-gradient(135deg, ${config.primaryColor} 0%, ${config.secondaryColor || config.primaryColor} 100%)`)
                              : (config.botMessageColor || 'white'),
                            color: message.isUser ? 'white' : (config.textColor || '#1e293b'),
                            border: message.isUser ? 'none' : '1px solid rgba(0, 0, 0, 0.06)',
                            borderBottomLeftRadius: message.isUser ? '24px' : '8px',
                            borderBottomRightRadius: message.isUser ? '8px' : '24px',
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = message.isUser 
                              ? '0 8px 24px rgba(0, 0, 0, 0.15)' 
                              : '0 8px 24px rgba(0, 0, 0, 0.12)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = message.isUser 
                              ? '0 4px 16px rgba(0, 0, 0, 0.1)' 
                              : '0 4px 16px rgba(0, 0, 0, 0.08)';
                          }}
                        >
                          {/* Message shine effect */}
                          {!message.isUser && (
                            <div style={{
                              position: 'absolute',
                              top: 0,
                              left: '-100%',
                              width: '100%',
                              height: '100%',
                              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                              animation: 'shimmer 3s infinite'
                            }} />
                          )}
                          
                          <MessageContent message={message} />
                        </div>
                        
                        {/* Enhanced Timestamp */}
                        <span style={{
                          fontSize: '11px',
                          color: '#64748b',
                          marginTop: '8px',
                          padding: '0 8px',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <Clock size={10} />
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Enhanced Typing Indicator */}
                  {isLoading && (
                    <div className="animate-fade-in-up" style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '16px',
                      opacity: 0,
                      animation: 'fadeInUp 0.4s ease-out forwards'
                    }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: `linear-gradient(135deg, ${config.primaryColor} 0%, ${config.secondaryColor || config.primaryColor} 100%)`,
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        border: '3px solid rgba(255, 255, 255, 0.2)',
                        flexShrink: 0,
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          position: 'absolute',
                          top: '-50%',
                          left: '-50%',
                          width: '200%',
                          height: '200%',
                          background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent)',
                          transform: 'rotate(45deg)',
                          animation: 'shimmer 2s infinite'
                        }} />
                        <Bot size={20} />
                      </div>
                      
                      <div style={{
                        background: config.botMessageColor || 'white',
                        border: '1px solid rgba(0, 0, 0, 0.06)',
                        padding: '20px 24px',
                        borderRadius: '24px',
                        borderBottomLeftRadius: '8px',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                        color: config.textColor || '#1e293b',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        {/* Typing animation background */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.05), transparent)',
                          animation: 'shimmer 2s infinite'
                        }} />
                        
                        <div style={{ 
                          display: 'flex', 
                          gap: '6px', 
                          alignItems: 'center',
                          position: 'relative',
                          zIndex: 1
                        }}>
                          {/* Enhanced typing dots */}
                          {[0, 1, 2].map((i) => (
                            <div
                              key={i}
                              style={{
                                width: '8px',
                                height: '8px',
                                backgroundColor: config.primaryColor || '#3B82F6',
                                borderRadius: '50%',
                                animation: 'typingPulse 1.4s infinite ease-in-out',
                                animationDelay: `${i * 0.2}s`,
                                boxShadow: `0 2px 4px ${config.primaryColor || '#3B82F6'}40`
                              }}
                            />
                          ))}
                          <span style={{
                            marginLeft: '8px',
                            fontSize: '13px',
                            fontWeight: '500',
                            color: config.textColor || '#64748b'
                          }}>
                            AI is thinking...
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </main>

            {/* Enhanced Input Area */}
            <footer style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderTop: '1px solid rgba(0, 0, 0, 0.06)',
              boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.08)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              justifyContent: 'center',
              position: 'relative'
            }}>
              {/* Subtle top border gradient */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: `linear-gradient(90deg, transparent, ${config.primaryColor}40, transparent)`
              }} />

              <div style={{
                width: '100%',
                maxWidth: '1000px',
                margin: '0 16px',
                padding: '20px 0'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: '16px'
                }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    {/* Enhanced Input Field */}
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={config.placeholderText}
                        disabled={isLoading || !isOnline}
                        className="mobile-input"
                        style={{
                          width: '100%',
                          padding: '16px 60px 16px 20px',
                          fontSize: '16px',
                          border: '2px solid #e2e8f0',
                          borderRadius: '16px',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                          backgroundColor: 'white',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                          fontFamily: config.fontFamily,
                          color: config.textColor || '#1e293b',
                          minHeight: '52px',
                          resize: 'none'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = config.primaryColor || '#3b82f6';
                          e.target.style.boxShadow = `0 0 0 3px ${config.primaryColor || '#3b82f6'}20, 0 4px 12px rgba(0, 0, 0, 0.08)`;
                          e.target.style.transform = 'translateY(-1px)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e2e8f0';
                          e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
                          e.target.style.transform = 'translateY(0)';
                        }}
                      />
                      
                      {/* Character Counter */}
                      <div style={{
                        position: 'absolute',
                        right: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '11px',
                        color: '#94a3b8',
                        fontWeight: '600',
                        background: 'rgba(255, 255, 255, 0.9)',
                        padding: '2px 6px',
                        borderRadius: '6px',
                        backdropFilter: 'blur(4px)'
                      }}>
                        {inputValue.length}/500
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Send Button */}
                  <button
                    onClick={sendMessage}
                    disabled={isLoading || !inputValue.trim() || !isOnline}
                    className="mobile-send-button"
                    style={{
                      minHeight: '52px',
                      minWidth: '52px',
                      borderRadius: '16px',
                      border: 'none',
                      background: isLoading || !inputValue.trim() || !isOnline
                        ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)'
                        : `linear-gradient(135deg, ${config.primaryColor} 0%, ${config.secondaryColor || config.primaryColor} 100%)`,
                      color: 'white',
                      cursor: isLoading || !inputValue.trim() || !isOnline ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: isLoading || !inputValue.trim() || !isOnline
                        ? '0 2px 8px rgba(0, 0, 0, 0.1)'
                        : `0 4px 16px ${config.primaryColor || '#3b82f6'}40`,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading && inputValue.trim() && isOnline) {
                        e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                        e.currentTarget.style.boxShadow = `0 8px 24px ${config.primaryColor || '#3b82f6'}50`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isLoading && inputValue.trim() && isOnline) {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = `0 4px 16px ${config.primaryColor || '#3b82f6'}40`;
                      }
                    }}
                  >
                    {/* Button shine effect */}
                    {!isLoading && inputValue.trim() && isOnline && (
                      <div style={{
                        position: 'absolute',
                        top: '-50%',
                        left: '-50%',
                        width: '200%',
                        height: '200%',
                        background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent)',
                        transform: 'rotate(45deg)',
                        animation: 'shimmer 3s infinite'
                      }} />
                    )}
                    
                    {isLoading ? (
                      <div style={{
                        width: '20px',
                        height: '20px',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                    ) : (
                      <Send size={20} style={{ position: 'relative', zIndex: 1 }} />
                    )}
                  </button>
                </div>

                {/* Enhanced Status Bar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '16px',
                  padding: '0 4px'
                }}>
                  {/* Connection Status */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    color: '#64748b',
                    fontWeight: '500'
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: isOnline ? '#10b981' : '#ef4444',
                      borderRadius: '50%',
                      boxShadow: isOnline ? '0 0 8px rgba(16, 185, 129, 0.4)' : '0 0 8px rgba(239, 68, 68, 0.4)',
                      animation: isOnline ? 'pulse 2s infinite' : 'none'
                    }} />
                    <span>{isOnline ? 'Connected' : 'Reconnecting...'}</span>
                    {isLoading && (
                      <>
                        <span>•</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                          <Sparkles size={12} style={{ animation: 'spin 2s linear infinite' }} />
                          AI responding...
                        </span>
                      </>
                    )}
                  </div>

                  {/* Enhanced Security Badge */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    color: '#64748b',
                    fontWeight: '500'
                  }}>
                    <Shield size={10} />
                    <span>Secure</span>
                  </div>
                </div>

                {/* Enhanced Footer Attribution */}
                <div style={{
                  textAlign: 'center',
                  marginTop: '12px'
                }}>
                  <a
                    href="https://axiestudio.se"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '11px',
                      color: '#94a3b8',
                      textDecoration: 'none',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      padding: '6px 12px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.5)',
                      backdropFilter: 'blur(4px)',
                      border: '1px solid rgba(0, 0, 0, 0.04)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#1e293b';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#94a3b8';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <MessageCircle size={12} />
                    Powered by{' '}
                    <span style={{
                      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      fontWeight: '700'
                    }}>
                      Axie Studio
                    </span>
                  </a>
                </div>
              </div>
            </footer>
          </>
        )}
      </div>
    </>
  );
};