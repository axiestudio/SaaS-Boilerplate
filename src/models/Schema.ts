import {
  bigint,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

// This file defines the structure of your database tables using the Drizzle ORM.

// To modify the database schema:
// 1. Update this file with your desired changes.
// 2. Generate a new migration by running: `npm run db:generate`

// The generated migration file will reflect your schema changes.
// The migration is automatically applied during the next database interaction,
// so there's no need to run it manually or restart the Next.js server.

// Need a database for production? Check out https://www.prisma.io/?via=saasboilerplatesrc
// Tested and compatible with Next.js Boilerplate
export const organizationSchema = pgTable(
  'organization',
  {
    id: text('id').primaryKey(),
    stripeCustomerId: text('stripe_customer_id'),
    stripeSubscriptionId: text('stripe_subscription_id'),
    stripeSubscriptionPriceId: text('stripe_subscription_price_id'),
    stripeSubscriptionStatus: text('stripe_subscription_status'),
    stripeSubscriptionCurrentPeriodEnd: bigint(
      'stripe_subscription_current_period_end',
      { mode: 'number' },
    ),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => {
    return {
      stripeCustomerIdIdx: uniqueIndex('stripe_customer_id_idx').on(
        table.stripeCustomerId,
      ),
    };
  },
);

export const todoSchema = pgTable('todo', {
  id: serial('id').primaryKey(),
  ownerId: text('owner_id').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const chatInterfaceSchema = pgTable('chat_interface', {
  id: serial('id').primaryKey(),
  ownerId: text('owner_id').notNull(),
  slug: text('slug').unique().notNull(),
  name: text('name').notNull(),
  apiEndpoint: text('api_endpoint').notNull(),
  apiKey: text('api_key').notNull(),
  
  // Branding customization
  brandName: text('brand_name').notNull(),
  logoUrl: text('logo_url'),
  primaryColor: text('primary_color').default('#3B82F6').notNull(),
  secondaryColor: text('secondary_color').default('#F3F4F6').notNull(),
  welcomeMessage: text('welcome_message').default('Hello! How can I help you today?').notNull(),
  placeholderText: text('placeholder_text').default('Type your message...').notNull(),
  
  // Chat settings
  isActive: boolean('is_active').default(true).notNull(),
  
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const chatMessageSchema = pgTable('chat_message', {
  id: serial('id').primaryKey(),
  chatInterfaceId: integer('chat_interface_id').references(() => chatInterfaceSchema.id).notNull(),
  sessionId: text('session_id').notNull(),
  message: text('message').notNull(),
  isUser: boolean('is_user').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});
