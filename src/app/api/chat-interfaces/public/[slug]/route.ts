import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/libs/DB';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const chatInterface = await db.query.chatInterfaceSchema.findFirst({
      where: (chatInterface, { eq, and }) => 
        and(
          eq(chatInterface.slug, slug),
          eq(chatInterface.isActive, true)
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
      return NextResponse.json(
        { error: 'Chat interface not found or inactive' },
        { status: 404 }
      );
    }

    return NextResponse.json(chatInterface);
  } catch (error) {
    console.error('Error fetching public chat interface:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}