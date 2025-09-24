/*
  # Create Demo Chat Interface

  1. New Demo Interface
    - Creates a professional demo chat interface with slug "demo"
    - Pre-configured with Axie Studio branding and professional styling
    - Uses mock API endpoint for demonstration purposes
    - Active by default for public access

  2. Purpose
    - Provides a dedicated demo experience for the "View Live Demo" button
    - Showcases the platform's capabilities with professional branding
    - Ensures consistent demo experience for all visitors
*/

-- Insert the demo chat interface
INSERT INTO chat_interface (
  owner_id,
  slug,
  name,
  api_endpoint,
  api_key,
  brand_name,
  logo_url,
  primary_color,
  secondary_color,
  font_family,
  text_color,
  bot_message_color,
  user_message_color,
  welcome_message,
  placeholder_text,
  is_active,
  created_at,
  updated_at
) VALUES (
  'demo-system',
  'demo',
  'Axie Studio Demo Chat',
  'https://flow.axiestudio.se/api/v1/run/demo',
  'demo-api-key-12345',
  'Axie Studio',
  'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
  '#6366F1',
  '#F8FAFC',
  'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  '#1E293B',
  '#FFFFFF',
  '#6366F1',
  'Welcome to Axie Studio! 👋 I''m here to help you explore our AI-powered chat platform. Ask me anything about our features, pricing, or how to get started!',
  'Ask me about Axie Studio features...',
  true,
  now(),
  now()
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  api_endpoint = EXCLUDED.api_endpoint,
  api_key = EXCLUDED.api_key,
  brand_name = EXCLUDED.brand_name,
  logo_url = EXCLUDED.logo_url,
  primary_color = EXCLUDED.primary_color,
  secondary_color = EXCLUDED.secondary_color,
  font_family = EXCLUDED.font_family,
  text_color = EXCLUDED.text_color,
  bot_message_color = EXCLUDED.bot_message_color,
  user_message_color = EXCLUDED.user_message_color,
  welcome_message = EXCLUDED.welcome_message,
  placeholder_text = EXCLUDED.placeholder_text,
  is_active = EXCLUDED.is_active,
  updated_at = now();