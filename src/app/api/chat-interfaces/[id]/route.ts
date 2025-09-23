import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { eq, and } from 'drizzle-orm';

import { db } from '@/libs/DB';
import { chatInterfaceSchema } from '@/models/Schema';

const updateChatInterfaceSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  slug: z.string().min(3).max(50).regex(/^[a-z0-9-]+$/).optional(),
  apiEndpoint: z.string().url().optional(),
  apiKey: z.string().min(1).optional(),
  brandName: z.string().min(1).max(50).optional(),
  logoUrl: z.string().url().optional().or(z.literal('')),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  welcomeMessage: z.string().min(1).max(200).optional(),
  placeholderText: z.string().min(1).max(100).optional(),
  isActive: z.boolean().optional(),
});

const toggleAccessSchema = z.object({
  isActive: z.boolean(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const chatInterface = await db.query.chatInterfaceSchema.findFirst({
      where: and(
        eq(chatInterfaceSchema.id, id),
        eq(chatInterfaceSchema.ownerId, userId)
      ),
    });

    if (!chatInterface) {
      return NextResponse.json(
        { error: 'Chat interface not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(chatInterface);
  } catch (error) {
    console.error('Error fetching chat interface:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json();
    const validatedData = updateChatInterfaceSchema.parse(body);

    // Check if the chat interface exists and belongs to the user
    const existingInterface = await db.query.chatInterfaceSchema.findFirst({
      where: and(
        eq(chatInterfaceSchema.id, id),
        eq(chatInterfaceSchema.ownerId, userId)
      ),
    });

    if (!existingInterface) {
      return NextResponse.json(
        { error: 'Chat interface not found' },
        { status: 404 }
      );
    }

    // Check if slug is already taken by another interface
    if (validatedData.slug && validatedData.slug !== existingInterface.slug) {
      const slugExists = await db.query.chatInterfaceSchema.findFirst({
        where: and(
          eq(chatInterfaceSchema.slug, validatedData.slug),
          // Make sure it's not the same interface
          eq(chatInterfaceSchema.ownerId, userId)
        ),
      });

      if (slugExists && slugExists.id !== id) {
        return NextResponse.json(
          { error: 'This URL slug is already taken. Please choose a different one.' },
          { status: 400 }
        );
      }
    }

    // Update the chat interface
    const [updatedInterface] = await db
      .update(chatInterfaceSchema)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(and(
        eq(chatInterfaceSchema.id, id),
        eq(chatInterfaceSchema.ownerId, userId)
      ))
      .returning();

    return NextResponse.json(updatedInterface);
  } catch (error) {
    console.error('Error updating chat interface:', error);
    
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json();
    const validatedData = toggleAccessSchema.parse(body);

    // Check if the chat interface exists and belongs to the user
    const existingInterface = await db.query.chatInterfaceSchema.findFirst({
      where: and(
        eq(chatInterfaceSchema.id, id),
        eq(chatInterfaceSchema.ownerId, userId)
      ),
    });

    if (!existingInterface) {
      return NextResponse.json(
        { error: 'Chat interface not found' },
        { status: 404 }
      );
    }

    // Update only the isActive field
    const [updatedInterface] = await db
      .update(chatInterfaceSchema)
      .set({
        isActive: validatedData.isActive,
        updatedAt: new Date(),
      })
      .where(and(
        eq(chatInterfaceSchema.id, id),
        eq(chatInterfaceSchema.ownerId, userId)
      ))
      .returning();

    return NextResponse.json(updatedInterface);
  } catch (error) {
    console.error('Error toggling chat interface access:', error);
    
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    // Check if the chat interface exists and belongs to the user
    const existingInterface = await db.query.chatInterfaceSchema.findFirst({
      where: and(
        eq(chatInterfaceSchema.id, id),
        eq(chatInterfaceSchema.ownerId, userId)
      ),
    });

    if (!existingInterface) {
      return NextResponse.json(
        { error: 'Chat interface not found' },
        { status: 404 }
      );
    }

    // Delete the chat interface
    await db
      .delete(chatInterfaceSchema)
      .where(and(
        eq(chatInterfaceSchema.id, id),
        eq(chatInterfaceSchema.ownerId, userId)
      ));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting chat interface:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}