import Link from 'next/link';
import { Plus, Settings, MessageCircle, Zap, BarChart3, Users } from 'lucide-react';

import { ChatInterfaceList } from '@/features/chat/ChatInterfaceList';

const DashboardIndexPage = () => {

  return (
    <>
      {/* Modern Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center">
            <MessageCircle className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Chat Interface Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your chat interfaces and monitor performance
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Enhanced Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/dashboard/chat-interfaces/new" className="group">
            <div className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 group-hover:scale-105">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Plus className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Create New Chat Interface</h3>
              </div>
              <p className="text-sm text-muted-foreground">Get started with creating your first chat interface</p>
            </div>
          </Link>

          <Link href="/dashboard/account" className="group">
            <div className="p-6 bg-gradient-to-br from-blue-500/5 to-blue-500/10 border border-blue-500/20 rounded-2xl hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 group-hover:scale-105">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <Settings className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-foreground">Account Settings</h3>
              </div>
              <p className="text-sm text-muted-foreground">Manage your account preferences and settings</p>
            </div>
          </Link>

          <div className="p-6 bg-gradient-to-br from-green-500/5 to-green-500/10 border border-green-500/20 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-foreground">Analytics</h3>
            </div>
            <p className="text-sm text-muted-foreground">View detailed performance metrics</p>
          </div>

          <div className="p-6 bg-gradient-to-br from-purple-500/5 to-purple-500/10 border border-purple-500/20 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-foreground">User Management</h3>
            </div>
            <p className="text-sm text-muted-foreground">Manage users and permissions</p>
          </div>
        </div>

        {/* Enhanced Chat Interfaces Overview */}
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
              <MessageCircle className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Your Chat Interfaces</h2>
              <p className="text-sm text-muted-foreground">Manage and customize your chat interfaces</p>
            </div>
          </div>
          <ChatInterfaceList />
        </div>

        {/* Modern Getting Started Guide */}
        <div className="bg-gradient-to-br from-primary/5 via-transparent to-primary/5 border border-primary/10 rounded-3xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-3">
              <Zap className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Getting Started</h2>
            </div>
            <p className="text-muted-foreground">Follow these steps to set up your first chat interface</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative p-6 bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl hover:shadow-lg transition-all duration-300">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center text-primary-foreground text-sm font-bold shadow-lg">
                1
              </div>
              <div className="mt-2">
                <h3 className="font-semibold mb-2">Configure API</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Set up your Axie Studio API endpoint and key
                </p>
              </div>
            </div>

            <div className="relative p-6 bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl hover:shadow-lg transition-all duration-300">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg">
                2
              </div>
              <div className="mt-2">
                <h3 className="font-semibold mb-2">Customize Interface</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Brand your chat interface with colors, logo, and messages
                </p>
              </div>
            </div>

            <div className="relative p-6 bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl hover:shadow-lg transition-all duration-300">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg">
                3
              </div>
              <div className="mt-2">
                <h3 className="font-semibold mb-2">Share & Deploy</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Get your unique chat URL and share it with your customers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardIndexPage;