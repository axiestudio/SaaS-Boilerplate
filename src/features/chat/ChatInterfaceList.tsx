import { useAuth } from '@clerk/nextjs';
import { Plus, ExternalLink, Settings, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type ChatInterface = {
  id: number;
  slug: string;
  name: string;
  brandName: string;
  isActive: boolean;
  createdAt: string;
};

export const ChatInterfaceList = () => {
  const { userId } = useAuth();
  const [interfaces, setInterfaces] = useState<ChatInterface[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch chat interfaces from API
    // For now, showing empty state
    setLoading(false);
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (interfaces.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No chat interfaces yet</h3>
        <p className="text-muted-foreground mb-6">
          Create your first chat interface to get started
        </p>
        <Link href="/dashboard/chat-interfaces/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Chat Interface
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {interfaces.map((interface_) => (
        <div key={interface_.id} className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold">{interface_.name}</h3>
                <Badge variant={interface_.isActive ? 'default' : 'secondary'}>
                  {interface_.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Brand: {interface_.brandName}
              </p>
              <p className="text-xs text-muted-foreground">
                Created: {new Date(interface_.createdAt).toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Link href={`/chat/${interface_.slug}`} target="_blank">
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Chat
                </Button>
              </Link>
              <Link href={`/dashboard/chat-interfaces/${interface_.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};