import { NextRequest, NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';

import { db } from '@/libs/DB';
import { chatInterfaceSchema } from '@/models/Schema';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    console.log('🔍 Looking for chat interface with slug:', slug);

    const chatInterface = await db.query.chatInterfaceSchema.findFirst({
      where: 
        and(
          eq(chatInterfaceSchema.slug, slug),
          eq(chatInterfaceSchema.isActive, true)
        ),
      columns: {
        id: true,
        name: true,
        brandName: true,
        logoUrl: true,
        primaryColor: true,
        secondaryColor: true,
        welcomeMessage: true,
        placeholderText: true,
        apiEndpoint: true,
        apiKey: true,
        isActive: true,
      },
    });

    if (!chatInterface) {
      console.log('❌ Chat interface not found for slug:', slug);
      return NextResponse.json(
        {
          error: 'Chat interface not found or currently unavailable',
          message: 'This chat interface is currently not public. Please check back later or contact the owner.',
          isPublic: false
        },
        { status: 404 }
      );
    }

    console.log('✅ Found chat interface:', chatInterface.name);

    return NextResponse.json({
      ...chatInterface,
      isPublic: true
    });
  } catch (error) {
    console.error('Error fetching public chat interface:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Something went wrong while loading the chat interface. Please try again later.',
        isPublic: false
      },
      { status: 500 }
    );
  }
}