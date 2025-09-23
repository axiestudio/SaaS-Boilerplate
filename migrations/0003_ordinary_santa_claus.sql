-- Create chat_message table if it doesn't exist
CREATE TABLE IF NOT EXISTS "chat_message" (
	"id" serial PRIMARY KEY NOT NULL,
	"chat_interface_id" integer NOT NULL,
	"session_id" text NOT NULL,
	"message" text NOT NULL,
	"is_user" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP INDEX IF EXISTS "slug_idx";--> statement-breakpoint
ALTER TABLE "chat_interface" ALTER COLUMN "secondary_color" SET DEFAULT '#F3F4F6';--> statement-breakpoint
ALTER TABLE "chat_interface" ALTER COLUMN "welcome_message" SET DEFAULT 'Hello! How can I help you today?';--> statement-breakpoint
ALTER TABLE "chat_interface" ALTER COLUMN "placeholder_text" SET DEFAULT 'Type your message...';--> statement-breakpoint
-- Add columns with proper IF NOT EXISTS logic
DO $$
BEGIN
    -- Add name column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chat_interface' AND column_name = 'name') THEN
        ALTER TABLE "chat_interface" ADD COLUMN "name" text NOT NULL DEFAULT '';
    END IF;

    -- Add api_endpoint column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chat_interface' AND column_name = 'api_endpoint') THEN
        ALTER TABLE "chat_interface" ADD COLUMN "api_endpoint" text NOT NULL DEFAULT '';
    END IF;

    -- Add api_key column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chat_interface' AND column_name = 'api_key') THEN
        ALTER TABLE "chat_interface" ADD COLUMN "api_key" text NOT NULL DEFAULT '';
    END IF;

    -- Add is_active column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chat_interface' AND column_name = 'is_active') THEN
        ALTER TABLE "chat_interface" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;
    END IF;

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
END $$;--> statement-breakpoint
-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'chat_message_chat_interface_id_chat_interface_id_fk') THEN
        ALTER TABLE "chat_message" ADD CONSTRAINT "chat_message_chat_interface_id_chat_interface_id_fk" FOREIGN KEY ("chat_interface_id") REFERENCES "public"."chat_interface"("id") ON DELETE no action ON UPDATE no action;
    END IF;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
-- Add unique constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'chat_interface_slug_unique') THEN
        ALTER TABLE "chat_interface" ADD CONSTRAINT "chat_interface_slug_unique" UNIQUE("slug");
    END IF;
END $$;