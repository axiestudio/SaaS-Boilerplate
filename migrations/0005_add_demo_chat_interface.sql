/*
  # Add Demo Chat Interface for Neon PostgreSQL
  
  1. Creates a professional demo chat interface with slug "demo"
  2. Uses proper PostgreSQL syntax compatible with Neon
  3. Includes IF/ELSE logic to handle existing records
  4. Safe for automatic migration system
*/

-- Check if demo interface already exists and handle accordingly
DO $$
BEGIN
  -- Check if the demo interface already exists
  IF EXISTS (SELECT 1 FROM chat_interface WHERE slug = 'demo') THEN
    -- Update existing demo interface
    UPDATE chat_interface SET
      name = 'Axie Studio Demo Chat',
      api_endpoint = 'https://flow.axiestudio.se/api/v1/run/demo',
      api_key = 'demo-api-key-12345',
      brand_name = 'Axie Studio',
      logo_url = 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
      primary_color = '#6366F1',
      secondary_color = '#F8FAFC',
      font_family = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      text_color = '#1E293B',
      bot_message_color = '#FFFFFF',
      user_message_color = '#6366F1',
      welcome_message = 'Welcome to Axie Studio! 👋 I''m here to help you explore our AI-powered chat platform. Ask me anything about our features, pricing, or how to get started!',
      placeholder_text = 'Ask me about Axie Studio features...',
      is_active = true,
      updated_at = CURRENT_TIMESTAMP
    WHERE slug = 'demo';
    
    RAISE NOTICE 'Demo chat interface updated successfully';
  ELSE
    -- Insert new demo interface
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
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP
    );
    
    RAISE NOTICE 'Demo chat interface created successfully';
  END IF;
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error creating/updating demo interface: %', SQLERRM;
    -- Don't fail the migration, just log the error
END $$;
