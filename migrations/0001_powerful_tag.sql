CREATE TABLE IF NOT EXISTS "chat_interface" (
	"id" serial PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"api_endpoint" text NOT NULL,
	"api_key" text NOT NULL,
	"brand_name" text NOT NULL,
	"logo_url" text,
	"primary_color" text DEFAULT '#3B82F6' NOT NULL,
	"secondary_color" text DEFAULT '#F3F4F6' NOT NULL,
	"welcome_message" text DEFAULT 'Hello! How can I help you today?' NOT NULL,
	"placeholder_text" text DEFAULT 'Type your message...' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "chat_interface_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chat_message" (
	"id" serial PRIMARY KEY NOT NULL,
	"chat_interface_id" integer NOT NULL,
	"session_id" text NOT NULL,
	"message" text NOT NULL,
	"is_user" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat_message" ADD CONSTRAINT "chat_message_chat_interface_id_chat_interface_id_fk" FOREIGN KEY ("chat_interface_id") REFERENCES "public"."chat_interface"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
