import { NextResponse } from 'next/server';
import { db } from '@/libs/DB';

export async function GET() {
  try {
    console.log('🔍 Fetching all chat interfaces for debugging...');
    
    const chatInterfaces = await db.query.chatInterfaceSchema.findMany({
      columns: {
        id: true,
        slug: true,
        name: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: (chatInterface, { desc }) => [desc(chatInterface.createdAt)],
    });
    
    console.log(`📊 Found ${chatInterfaces.length} chat interfaces:`);
    chatInterfaces.forEach((ci, index) => {
      console.log(`  ${index + 1}. ID: ${ci.id}, Slug: "${ci.slug}", Name: "${ci.name}", Active: ${ci.isActive}`);
    });
    
    return NextResponse.json({
      success: true,
      count: chatInterfaces.length,
      chatInterfaces,
    });
  } catch (error) {
    console.error('❌ Error fetching chat interfaces:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch chat interfaces',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
