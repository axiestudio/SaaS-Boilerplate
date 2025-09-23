-- Add new typography and color customization columns to chat_interface table
ALTER TABLE "chat_interface" 
ADD COLUMN "font_family" text DEFAULT 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' NOT NULL,
ADD COLUMN "text_color" text DEFAULT '#1F2937' NOT NULL,
ADD COLUMN "bot_message_color" text DEFAULT '#F9FAFB' NOT NULL,
ADD COLUMN "user_message_color" text DEFAULT '#3B82F6' NOT NULL;
