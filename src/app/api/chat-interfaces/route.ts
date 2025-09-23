import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { db } from '@/libs/DB';
import { chatInterfaceSchema } from '@/models/Schema';

const createChatInterfaceSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(3).max(50).regex(/^[a-z0-9-]+$/),
  apiEndpoint: z.string().url(),
  apiKey: z.string().min(1),
  brandName: z.string().min(1).max(50),
  logoUrl: z.string().url().optional().or(z.literal('')),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i),
  fontFamily: z.string().min(1),
  textColor: z.string().regex(/^#[0-9A-F]{6}$/i),
  botMessageColor: z.string().regex(/^#[0-9A-F]{6}$/i),
  userMessageColor: z.string().regex(/^#[0-9A-F]{6}$/i),
  welcomeMessage: z.string().min(1).max(200),
  placeholderText: z.string().min(1).max(100),
  ownerId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createChatInterfaceSchema.parse(body);

    // Check if slug is already taken
    const existingInterface = await db.query.chatInterfaceSchema.findFirst({
      where: (chatInterface, { eq }) => eq(chatInterface.slug, validatedData.slug),
    });

    if (existingInterface) {
      return NextResponse.json(
        { error: 'This URL slug is already taken. Please choose a different one.' },
        { status: 400 }
      );
    }

    // Create the chat interface
    const [newInterface] = await db.insert(chatInterfaceSchema).values({
      ...validatedData,
      ownerId: userId,
    }).returning();

    return NextResponse.json(newInterface, { status: 201 });
  } catch (error) {
    console.error('Error creating chat interface:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const interfaces = await db.query.chatInterfaceSchema.findMany({
      where: (chatInterface, { eq }) => eq(chatInterface.ownerId, userId),
      orderBy: (chatInterface, { desc }) => [desc(chatInterface.createdAt)],
    });

    return NextResponse.json(interfaces);
  } catch (error) {
    console.error('Error fetching chat interfaces:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}