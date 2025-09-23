import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { db } from '@/libs/DB';
import { chatMessageSchema } from '@/models/Schema';

const createMessageSchema = z.object({
  chatInterfaceId: z.number(),
  sessionId: z.string(),
  messages: z.array(z.object({
    text: z.string(),
    isUser: z.boolean(),
  })),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chatInterfaceId, sessionId, messages } = createMessageSchema.parse(body);

    // Insert all messages
    const insertedMessages = await Promise.all(
      messages.map(message =>
        db.insert(chatMessageSchema).values({
          chatInterfaceId,
          sessionId,
          message: message.text,
          isUser: message.isUser,
        }).returning()
      )
    );

    return NextResponse.json({ success: true, messages: insertedMessages });
  } catch (error) {
    console.error('Error saving chat messages:', error);
    
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