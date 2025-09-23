'use client';

import { Send, Minimize2, Maximize2, User, Bot, MessageCircle } from 'lucide-react';
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
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
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

// Modern Button Component
const ModernButton = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  style = {},
  className = ''
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'ghost';
  style?: React.CSSProperties;
  className?: string;
}) => {
  const baseStyle: React.CSSProperties = {
    border: 'none',
    borderRadius: '12px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 0.5 : 1,
    ...style
  };

  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
    },
    ghost: {
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
      backdropFilter: 'blur(10px)'
    }
  };

  return (
    <button
      style={{ ...baseStyle, ...variantStyles[variant] }}
      onClick={onClick}
      disabled={disabled}
      className={className}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = variant === 'primary'
            ? '0 8px 20px rgba(59, 130, 246, 0.4)'
            : '0 4px 12px rgba(255, 255, 255, 0.2)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = variant === 'primary'
            ? '0 4px 12px rgba(59, 130, 246, 0.3)'
            : 'none';
        }
      }}
    >
      {children}
    </button>
  );
};

// Modern Input Component
const ModernInput = ({
  value,
  onChange,
  onKeyDown,
  placeholder,
  disabled = false,
  style = {}
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}) => {
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '16px 20px',
    fontSize: '16px',
    border: '2px solid #e2e8f0',
    borderRadius: '16px',
    outline: 'none',
    transition: 'all 0.2s ease',
    backgroundColor: 'white',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    ...style
  };

  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      style={inputStyle}
      onFocus={(e) => {
        e.target.style.borderColor = '#3b82f6';
        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
      }}
      onBlur={(e) => {
        e.target.style.borderColor = '#e2e8f0';
        e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
      }}
    />
  );
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
              fontSize: '16px',
              lineHeight: '1.6',
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
                  display: 'inline-block',
                  padding: '8px 16px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#3b82f6';
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
            background: '#1e293b',
            borderRadius: '8px',
            padding: '16px',
            margin: '8px 0',
            overflow: 'auto'
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
                    borderRadius: '4px',
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
            borderRadius: '8px',
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
            .replace(/`(.*?)`/g, '<code style="background: #f1f5f9; padding: 2px 4px; border-radius: 4px; font-family: monospace;">$1</code>')
            .replace(/\n/g, '<br>');
        };

        return (
          <div
            dangerouslySetInnerHTML={{ __html: renderMarkdown(message.text) }}
            style={{
              fontSize: '16px',
              lineHeight: '1.6',
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
                  fontSize: '16px',
                  lineHeight: '1.6',
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
                      display: 'inline-block',
                      padding: '8px 16px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#2563eb';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = '#3b82f6';
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
            fontSize: '16px',
            lineHeight: '1.6',
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

      // Update favicon with user's logo
      updateFavicon(config.logoUrl);
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
      console.log('🚀 Starting API call to:', config.apiEndpoint);
      console.log('🔑 Using API key:', config.apiKey ? 'Present' : 'Missing');
      console.log('📝 Request body:', {
        output_type: 'chat',
        input_type: 'chat',
        input_value: inputValue,
        session_id: sessionId,
      });

      // 🚀 OPTIMIZED API CALL FOR FASTER RESPONSES
      const response = await fetch(config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey,
          'Accept': 'application/json',
          'Cache-Control': 'no-cache', // Prevent caching delays
          'Connection': 'keep-alive', // Reuse connections
        },
        body: JSON.stringify({
          output_type: 'chat',
          input_type: 'chat',
          input_value: inputValue,
          session_id: sessionId,
        }),
        // Add timeout and performance optimizations
        signal: AbortSignal.timeout(30000), // 30 second timeout
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('🔍 API Response:', data);

      // Handle the specific API response structure from Axie Studio
      let botResponseText = '';

      try {
        // The response structure is: data.outputs[0].outputs[0].results.message.text
        if (data.outputs &&
            data.outputs[0] &&
            data.outputs[0].outputs &&
            data.outputs[0].outputs[0] &&
            data.outputs[0].outputs[0].results &&
            data.outputs[0].outputs[0].results.message &&
            data.outputs[0].outputs[0].results.message.text) {
          botResponseText = data.outputs[0].outputs[0].results.message.text;
        }
        // Fallback: try alternative paths
        else if (data.outputs &&
                 data.outputs[0] &&
                 data.outputs[0].outputs &&
                 data.outputs[0].outputs[0] &&
                 data.outputs[0].outputs[0].messages &&
                 data.outputs[0].outputs[0].messages[0] &&
                 data.outputs[0].outputs[0].messages[0].message) {
          botResponseText = data.outputs[0].outputs[0].messages[0].message;
        }
        // More fallbacks for different response structures
        else if (data.output) {
          botResponseText = data.output;
        } else if (data.response) {
          botResponseText = data.response;
        } else if (data.message) {
          botResponseText = data.message;
        } else if (data.text) {
          botResponseText = data.text;
        } else if (typeof data === 'string') {
          botResponseText = data;
        } else {
          console.error('❌ Unknown API response structure:', data);
          botResponseText = 'I apologize, but I encountered an error processing your request. Please try again.';
        }
      } catch (parseError) {
        console.error('❌ Error parsing API response:', parseError);
        botResponseText = 'I apologize, but I encountered an error processing your request. Please try again.';
      }

      // 🚀 OPTIMIZED: Process and show response immediately
      const processedResponse = processAIResponse(botResponseText);

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
        text: `I'm sorry, but I'm having trouble connecting right now. Please try again in a moment. (Error: ${error instanceof Error ? error.message : 'Unknown error'})`,
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
    <>
      {/* Mobile-First Responsive Styles */}
      <style jsx>{`
        /* Prevent horizontal scrolling on mobile */
        body {
          overflow-x: hidden;
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .mobile-message-bubble {
            max-width: 90% !important;
            padding: 12px 14px !important;
            font-size: 14px !important;
            line-height: 1.4 !important;
          }
          .mobile-avatar {
            width: 32px !important;
            height: 32px !important;
          }
          .mobile-header {
            padding: 6px 10px !important;
          }
          .mobile-input {
            font-size: 16px !important; /* Prevents zoom on iOS */
            min-height: 48px !important; /* Match button height */
          }
          .mobile-send-button {
            min-height: 48px !important;
            min-width: 48px !important;
            border-radius: 12px !important;
          }
          .mobile-brand-title {
            font-size: 14px !important;
          }
          .mobile-status-text {
            font-size: 10px !important;
          }
        }

        /* Small mobile devices */
        @media (max-width: 480px) {
          .mobile-message-bubble {
            max-width: 95% !important;
            padding: 10px 12px !important;
            font-size: 13px !important;
          }
          .mobile-container {
            margin: 0 4px !important;
          }
          .mobile-gap {
            gap: 8px !important;
          }
        }

        /* Landscape mobile */
        @media (max-width: 768px) and (orientation: landscape) {
          .mobile-header {
            padding: 4px 8px !important;
          }
          .mobile-brand-title {
            font-size: 13px !important;
          }
        }

        /* Enhanced typing animation */
        @keyframes typingBounce {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          30% {
            transform: translateY(-8px);
            opacity: 1;
          }
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: config.fontFamily || 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: config.textColor || '#1F2937'
      }}>
      {/* Compact Header - CONVERSATION FOCUSED */}
      <header style={{
        background: `linear-gradient(135deg, ${config.primaryColor} 0%, ${config.secondaryColor || config.primaryColor} 100%)`,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', // Much smaller shadow
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${config.secondaryColor || config.primaryColor}20` // Thinner border
      }}>
        <div
          className="mobile-header"
          style={{
            maxWidth: '900px', // Match the chat container width
            margin: '0 auto',
            padding: '8px 12px', // Smaller padding for mobile
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
          <div className="mobile-gap" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {config.logoUrl ? (
              <div style={{ position: 'relative' }}>
                <img
                  src={config.logoUrl}
                  alt={`${config.brandName} logo`}
                  style={{
                    width: '40px', // Smaller for mobile
                    height: '40px', // Smaller for mobile
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid rgba(255, 255, 255, 0.3)', // Thinner border
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' // Smaller shadow
                  }}
                />

              </div>
            ) : (
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '32px', // Even smaller for mobile
                  height: '32px', // Even smaller for mobile
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontSize: '14px', // Smaller font for mobile
                  fontWeight: 'bold',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)', // Smaller shadow
                  border: '2px solid rgba(255, 255, 255, 0.3)' // Thinner border
                }}>
                  <MessageCircle size={16} /> {/* Even smaller icon for mobile */}
                </div>

              </div>
            )}
            <div>
              <h1
                className="mobile-brand-title"
                style={{
                  fontSize: '16px', // Even smaller for mobile
                  fontWeight: '700', // Slightly lighter weight
                  color: 'white',
                  margin: '0 0 1px 0', // Smaller margin
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' // Smaller shadow
                }}>
                {config.brandName}
              </h1>

            </div>
          </div>

          <ModernButton
            variant="ghost"
            onClick={() => setIsMinimized(!isMinimized)}
            style={{
              padding: '8px', // Smaller padding
              borderRadius: '50%',
              minWidth: 'auto',
              width: '32px', // Smaller button
              height: '32px' // Smaller button
            }}
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />} {/* Smaller icons */}
          </ModernButton>
        </div>
      </header>

      {!isMinimized && (
        <>
          {/* Ultra Modern Messages Container - Focused on Chat */}
          <main style={{
            flex: 1,
            overflow: 'hidden',
            background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <div
              className="mobile-container"
              style={{
                height: '100%',
                width: '100%',
                maxWidth: '900px', // Narrower for better focus
                display: 'flex',
                flexDirection: 'column',
                margin: '0 8px' // Smaller side margins for mobile
              }}>
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px 12px', // Smaller padding for mobile
                display: 'flex',
                flexDirection: 'column',
                gap: '16px' // Smaller gap for mobile
              }}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px', // Smaller gap for mobile
                      flexDirection: message.isUser ? 'row-reverse' : 'row',
                      animation: 'fadeIn 0.3s ease-out'
                    }}
                  >
                    {/* Ultra Modern Avatar - Mobile Optimized */}
                    <div style={{
                      width: '36px', // Smaller for mobile
                      height: '36px', // Smaller for mobile
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', // Smaller shadow
                      border: '3px solid rgba(255, 255, 255, 0.3)',
                      background: message.isUser
                        ? 'linear-gradient(135deg, #64748b 0%, #475569 100%)'
                        : `linear-gradient(135deg, ${config.primaryColor} 0%, ${config.secondaryColor || config.primaryColor} 100%)`,
                      color: 'white',
                      flexShrink: 0
                    }}>
                      {message.isUser ? <User size={20} /> : <Bot size={20} />}
                    </div>

                    {/* Ultra Modern Message Bubble */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: message.isUser ? 'flex-end' : 'flex-start',
                      maxWidth: '85%', // Wider on mobile
                      width: '100%' // Full width available
                    }}>
                      <div
                        className="mobile-message-bubble"
                        style={{
                          padding: '14px 16px', // Smaller padding for mobile
                          borderRadius: '18px', // Slightly smaller radius
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', // Smaller shadow
                          transition: 'all 0.2s ease',
                          cursor: 'default',
                          background: message.isUser
                            ? (config.userMessageColor || `linear-gradient(135deg, ${config.primaryColor} 0%, ${config.secondaryColor || config.primaryColor} 100%)`)
                            : (config.botMessageColor || 'white'),
                          color: message.isUser ? 'white' : (config.textColor || '#1e293b'),
                          border: message.isUser ? 'none' : '1px solid #e2e8f0', // Thinner border
                          borderBottomLeftRadius: message.isUser ? '18px' : '6px',
                          borderBottomRightRadius: message.isUser ? '6px' : '18px'
                        }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                        <MessageContent
                          message={message}
                        />
                      </div>
                      <span style={{
                        fontSize: '11px', // Smaller for mobile
                        color: '#64748b',
                        marginTop: '6px', // Smaller margin
                        padding: '0 4px', // Smaller padding
                        fontWeight: '600'
                      }}>
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Ultra Modern Typing Indicator */}
                {isLoading && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    animation: 'fadeIn 0.3s ease-out'
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: `linear-gradient(135deg, ${config.primaryColor} 0%, ${config.secondaryColor || config.primaryColor} 100%)`,
                      color: 'white',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                      border: '3px solid rgba(255, 255, 255, 0.3)',
                      flexShrink: 0
                    }}>
                      <Bot size={20} />
                    </div>
                    <div style={{
                      background: config.botMessageColor || 'white',
                      border: '2px solid #e2e8f0',
                      padding: '20px 24px',
                      borderRadius: '24px',
                      borderBottomLeftRadius: '8px',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                      color: config.textColor || '#1e293b'
                    }}>
                      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                        {/* Enhanced typing animation with more dots and smoother motion */}
                        <div style={{
                          width: '6px',
                          height: '6px',
                          backgroundColor: config.primaryColor || '#3B82F6',
                          borderRadius: '50%',
                          animation: 'typingBounce 1.2s infinite ease-in-out'
                        }} />
                        <div style={{
                          width: '6px',
                          height: '6px',
                          backgroundColor: config.primaryColor || '#3B82F6',
                          borderRadius: '50%',
                          animation: 'typingBounce 1.2s infinite ease-in-out',
                          animationDelay: '0.2s'
                        }} />
                        <div style={{
                          width: '6px',
                          height: '6px',
                          backgroundColor: config.primaryColor || '#3B82F6',
                          borderRadius: '50%',
                          animation: 'typingBounce 1.2s infinite ease-in-out',
                          animationDelay: '0.4s'
                        }} />
                        <div style={{
                          width: '6px',
                          height: '6px',
                          backgroundColor: config.primaryColor || '#3B82F6',
                          borderRadius: '50%',
                          animation: 'typingBounce 1.2s infinite ease-in-out',
                          animationDelay: '0.6s'
                        }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </main>

          {/* Ultra Modern Input Area - Focused */}
          <footer style={{
            background: 'white',
            borderTop: '2px solid #e2e8f0',
            boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '100%',
              maxWidth: '900px', // Match the main container width
              margin: '0 8px', // Smaller margins for mobile
              padding: '8px 12px' // Even smaller padding for mobile
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center', // Center alignment for better button positioning
                gap: '12px' // Better gap for proper spacing
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ position: 'relative' }}>
                    <ModernInput
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={config.placeholderText}
                      onKeyDown={handleKeyDown}
                      disabled={isLoading}
                      style={{
                        paddingRight: '60px', // More space for character counter
                        fontSize: '16px', // 16px prevents zoom on iOS
                        minHeight: '48px', // Slightly taller for better proportion
                        borderRadius: '12px' // Match button border radius
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      right: '16px', // Smaller right position
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '10px', // Smaller font for mobile
                      color: '#64748b',
                      fontWeight: '600'
                    }}>
                      {inputValue.length}/500
                    </div>
                  </div>
                </div>
                <ModernButton
                  onClick={sendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  style={{
                    minHeight: '48px', // Match input height exactly
                    minWidth: '48px', // Square button for better proportion
                    borderRadius: '12px', // Match input border radius
                    background: `linear-gradient(135deg, ${config.primaryColor} 0%, ${config.secondaryColor || config.primaryColor} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0 // Prevent button from shrinking
                  }}
                >
                  {isLoading ? (
                    <div style={{
                      width: '18px', // Slightly larger spinner for better visibility
                      height: '18px', // Slightly larger spinner for better visibility
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                  ) : (
                    <Send size={18} />
                  )}
                </ModernButton>
              </div>


              {/* Compact Footer Attribution - LOWER & SMALLER */}
              <div style={{
                textAlign: 'center',
                marginTop: '8px' // Much smaller margin - LOWER!
              }}>
                <a
                  href="https://axiestudio.se"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px', // Smaller gap
                    fontSize: '11px', // Much smaller text
                    color: '#94a3b8', // Lighter color
                    textDecoration: 'none',
                    fontWeight: '500', // Lighter weight
                    transition: 'all 0.2s ease',
                    padding: '4px 8px', // Much smaller padding
                    borderRadius: '8px' // Smaller border radius
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#1e293b';
                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#64748b';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <MessageCircle size={12} /> {/* Smaller icon */}
                  Powered by{' '}
                  <span style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: '800'
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