'use client';

import { useAuth } from '@clerk/nextjs';
import { Plus, ExternalLink, Settings, MessageCircle, Copy, Eye, Trash2, Activity, Users } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type ChatInterface = {
  id: number;
  slug: string;
  name: string;
  brandName: string;
  isActive: boolean;
  createdAt: string;
  messageCount?: number;
};

type InterfaceStats = {
  id: number;
  slug: string;
  name: string;
  isActive: boolean;
  messageCount: number;
  sessionCount: number;
  isLive: boolean;
  lastActivity: string | null;
};

export const ChatInterfaceList = () => {
  const { userId } = useAuth();
  const t = useTranslations('ChatInterfaceList');
  const [interfaces, setInterfaces] = useState<ChatInterface[]>([]);
  const [stats, setStats] = useState<InterfaceStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Fetch realtime stats
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/chat-interfaces/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    const fetchInterfaces = async () => {
      try {
        const response = await fetch('/api/chat-interfaces');
        
        if (!response.ok) {
          throw new Error('Failed to fetch chat interfaces');
        }
        
        const data = await response.json();
        
        setInterfaces(data);
      } catch (error) {
        console.error('Error fetching chat interfaces:', error);
        setInterfaces([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchInterfaces();
      fetchStats(); // Initial stats fetch
    }
  }, [userId]);

  // Set up realtime polling for stats every 10 seconds
  useEffect(() => {
    if (!userId) return;

    const interval = setInterval(fetchStats, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, [userId]);

  const copyToClipboard = async (slug: string) => {
    const url = `${window.location.origin}/chat/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/chat-interfaces/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !currentStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle status');
      }

      setInterfaces(prev =>
        prev.map(interface_ =>
          interface_.id === id
            ? { ...interface_, isActive: !currentStatus }
            : interface_
        )
      );

      // Immediately refresh stats for real-time updates
      fetchStats();
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Failed to toggle status. Please try again.');
    }
  };

  const deleteInterface = async (id: number) => {
    if (!confirm('Are you sure you want to delete this chat interface? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/chat-interfaces/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete interface');
      }

      // Remove from local state
      setInterfaces(prev => prev.filter(interface_ => interface_.id !== id));

      // Immediately refresh stats for real-time updates
      fetchStats();

      alert('Chat interface deleted successfully!');
    } catch (error) {
      console.error('Error deleting interface:', error);
      alert('Failed to delete interface. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (interfaces.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-lg border">
        <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">{t('no_interfaces')}</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {t('create_first')}
        </p>
        <Link href="/dashboard/chat-interfaces/new">
          <Button size="lg">
            <Plus className="h-5 w-5 mr-2" />
            {t('create_first')}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{t('your_interfaces')}</h3>
          <p className="text-sm text-muted-foreground">
            {t('interfaces_count', { count: interfaces.length })}
          </p>
        </div>
        <Link href="/dashboard/chat-interfaces/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {t('create_new')}
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {interfaces.map((interface_) => (
          <div key={interface_.id} className="border rounded-lg p-6 bg-card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="font-semibold text-lg truncate">{interface_.name}</h3>
                  <Badge 
                    variant={interface_.isActive ? 'default' : 'secondary'}
                    className="shrink-0"
                  >
                    {interface_.isActive ? t('active_status') : t('inactive_status')}
                  </Badge>
                </div>
                
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">{t('brand')}:</span> {interface_.brandName}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-medium">{t('url')}:</span>
                    <code className="bg-muted px-2 py-1 rounded text-xs">
                      /chat/{interface_.slug}
                    </code>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => copyToClipboard(interface_.slug)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {copiedSlug === interface_.slug ? t('copied') : t('copy_url')}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Created: {new Date(interface_.createdAt).toLocaleDateString()}</span>
                    {interface_.messageCount !== undefined && (
                      <span>{interface_.messageCount} {t('messages')}</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href={`/chat/${interface_.slug}`} target="_blank">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>{t('preview_chat')}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href={`/dashboard/chat-interfaces/${interface_.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>{t('edit_interface')}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStatus(interface_.id, interface_.isActive)}
                      >
                        {interface_.isActive ? t('disable') : t('enable')}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {interface_.isActive ? t('disable_tooltip') : t('enable_tooltip')}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteInterface(interface_.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Permanently delete interface (cannot be undone)</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-6 pt-4 border-t">
              <div className="text-center">
                <div className="text-lg font-semibold text-primary flex items-center justify-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  {(() => {
                    const interfaceStats = stats.find(stat => stat.id === interface_.id);
                    return interfaceStats?.messageCount || interface_.messageCount || 0;
                  })()}
                </div>
                <div className="text-xs text-muted-foreground">{t('total_messages')}</div>
              </div>
              <div className="text-center">
                <div className={`text-lg font-semibold flex items-center justify-center gap-1 ${
                  (() => {
                    const interfaceStats = stats.find(stat => stat.id === interface_.id);
                    return interfaceStats?.isLive ? 'text-green-600' : 'text-gray-500';
                  })()
                }`}>
                  <Activity className="h-4 w-4" />
                  {(() => {
                    const interfaceStats = stats.find(stat => stat.id === interface_.id);
                    return interfaceStats?.isLive ? t('live') : (interface_.isActive ? t('online') : t('offline'));
                  })()}
                </div>
                <div className="text-xs text-muted-foreground">{t('current_status')}</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600 flex items-center justify-center gap-1">
                  <Users className="h-4 w-4" />
                  {(() => {
                    const interfaceStats = stats.find(stat => stat.id === interface_.id);
                    return interfaceStats?.sessionCount || 0;
                  })()}
                </div>
                <div className="text-xs text-muted-foreground">{t('total_sessions')}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};