import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/libs/DB';
import { chatInterfaceSchema, chatMessageSchema } from '@/models/Schema';
import { eq, and, sql, count, countDistinct } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all chat interfaces for the user with real-time stats
    const interfaceStats = await db
      .select({
        id: chatInterfaceSchema.id,
        slug: chatInterfaceSchema.slug,
        name: chatInterfaceSchema.name,
        isActive: chatInterfaceSchema.isActive,
        messageCount: count(chatMessageSchema.id),
        sessionCount: countDistinct(chatMessageSchema.sessionId),
        lastActivity: sql<Date>`MAX(${chatMessageSchema.createdAt})`,
      })
      .from(chatInterfaceSchema)
      .leftJoin(
        chatMessageSchema,
        eq(chatInterfaceSchema.id, chatMessageSchema.chatInterfaceId)
      )
      .where(eq(chatInterfaceSchema.ownerId, userId))
      .groupBy(
        chatInterfaceSchema.id,
        chatInterfaceSchema.slug,
        chatInterfaceSchema.name,
        chatInterfaceSchema.isActive
      )
      .orderBy(sql`MAX(${chatMessageSchema.createdAt}) DESC NULLS LAST`);

    // Calculate if interface is "live" (has activity in last 5 minutes)
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    const statsWithLiveStatus = interfaceStats.map(stat => ({
      ...stat,
      isLive: stat.lastActivity && stat.lastActivity > fiveMinutesAgo,
      messageCount: Number(stat.messageCount) || 0,
      sessionCount: Number(stat.sessionCount) || 0,
    }));

    return NextResponse.json({
      success: true,
      stats: statsWithLiveStatus,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error('Error fetching chat interface stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get stats for a specific interface
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { interfaceId } = await request.json();

    if (!interfaceId) {
      return NextResponse.json({ error: 'Interface ID required' }, { status: 400 });
    }

    // Get detailed stats for specific interface
    const [interfaceStat] = await db
      .select({
        id: chatInterfaceSchema.id,
        slug: chatInterfaceSchema.slug,
        name: chatInterfaceSchema.name,
        isActive: chatInterfaceSchema.isActive,
        messageCount: count(chatMessageSchema.id),
        sessionCount: countDistinct(chatMessageSchema.sessionId),
        lastActivity: sql<Date>`MAX(${chatMessageSchema.createdAt})`,
        todayMessages: sql<number>`COUNT(CASE WHEN DATE(${chatMessageSchema.createdAt}) = CURRENT_DATE THEN 1 END)`,
        todaySessions: sql<number>`COUNT(DISTINCT CASE WHEN DATE(${chatMessageSchema.createdAt}) = CURRENT_DATE THEN ${chatMessageSchema.sessionId} END)`,
      })
      .from(chatInterfaceSchema)
      .leftJoin(
        chatMessageSchema,
        eq(chatInterfaceSchema.id, chatMessageSchema.chatInterfaceId)
      )
      .where(
        and(
          eq(chatInterfaceSchema.id, interfaceId),
          eq(chatInterfaceSchema.ownerId, userId)
        )
      )
      .groupBy(
        chatInterfaceSchema.id,
        chatInterfaceSchema.slug,
        chatInterfaceSchema.name,
        chatInterfaceSchema.isActive
      );

    if (!interfaceStat) {
      return NextResponse.json({ error: 'Interface not found' }, { status: 404 });
    }

    // Calculate live status
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    const detailedStats = {
      ...interfaceStat,
      isLive: interfaceStat.lastActivity && interfaceStat.lastActivity > fiveMinutesAgo,
      messageCount: Number(interfaceStat.messageCount) || 0,
      sessionCount: Number(interfaceStat.sessionCount) || 0,
      todayMessages: Number(interfaceStat.todayMessages) || 0,
      todaySessions: Number(interfaceStat.todaySessions) || 0,
    };

    return NextResponse.json({
      success: true,
      stats: detailedStats,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error('Error fetching interface stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
