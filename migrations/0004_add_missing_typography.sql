-- Add only the missing typography columns with proper IF NOT EXISTS logic
DO $$
BEGIN
    -- Add font_family column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chat_interface' AND column_name = 'font_family') THEN
        ALTER TABLE "chat_interface" ADD COLUMN "font_family" text DEFAULT 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' NOT NULL;
    END IF;

    -- Add text_color column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chat_interface' AND column_name = 'text_color') THEN
        ALTER TABLE "chat_interface" ADD COLUMN "text_color" text DEFAULT '#1F2937' NOT NULL;
    END IF;

    -- Add bot_message_color column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chat_interface' AND column_name = 'bot_message_color') THEN
        ALTER TABLE "chat_interface" ADD COLUMN "bot_message_color" text DEFAULT '#F9FAFB' NOT NULL;
    END IF;

    -- Add user_message_color column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chat_interface' AND column_name = 'user_message_color') THEN
        ALTER TABLE "chat_interface" ADD COLUMN "user_message_color" text DEFAULT '#3B82F6' NOT NULL;
    END IF;
END $$;
