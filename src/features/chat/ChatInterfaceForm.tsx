'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@clerk/nextjs';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Save, Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { DashboardSection } from '@/features/dashboard/DashboardSection';
import { ChatPreview } from './ChatPreview';

const chatInterfaceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  apiEndpoint: z.string().url('Must be a valid URL'),
  apiKey: z.string().min(1, 'API Key is required'),
  brandName: z.string().min(1, 'Brand name is required'),
  logoUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
  welcomeMessage: z.string().min(1, 'Welcome message is required'),
  placeholderText: z.string().min(1, 'Placeholder text is required'),
});

type ChatInterfaceFormData = z.infer<typeof chatInterfaceSchema>;

export const ChatInterfaceForm = () => {
  const { userId } = useAuth();
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ChatInterfaceFormData>({
    resolver: zodResolver(chatInterfaceSchema),
    defaultValues: {
      name: '',
      apiEndpoint: 'https://flow.axiestudio.se/api/v1/run/',
      apiKey: '',
      brandName: '',
      logoUrl: '',
      primaryColor: '#3B82F6',
      secondaryColor: '#F3F4F6',
      welcomeMessage: 'Hello! How can I help you today?',
      placeholderText: 'Type your message...',
    },
  });

  const onSubmit = async (data: ChatInterfaceFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement API call to create chat interface
      console.log('Creating chat interface:', data);
      
      // Generate random slug
      const slug = Math.random().toString(36).substring(2, 15);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to dashboard or show success message
      alert('Chat interface created successfully!');
    } catch (error) {
      console.error('Error creating chat interface:', error);
      alert('Error creating chat interface. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const watchedValues = form.watch();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form */}
      <div className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Configuration */}
            <DashboardSection
              title="Basic Configuration"
              description="Configure your chat interface settings"
            >
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interface Name</FormLabel>
                      <FormControl>
                        <Input placeholder="My Chat Interface" {...field} />
                      </FormControl>
                      <FormDescription>
                        Internal name for your chat interface
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="apiEndpoint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Endpoint</FormLabel>
                      <FormControl>
                        <Input placeholder="https://flow.axiestudio.se/api/v1/run/your-flow-id" {...field} />
                      </FormControl>
                      <FormDescription>
                        Your Axie Studio flow API endpoint
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="apiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Key</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Your API key" {...field} />
                      </FormControl>
                      <FormDescription>
                        Your Axie Studio API key
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </DashboardSection>

            {/* Branding */}
            <DashboardSection
              title="Branding & Appearance"
              description="Customize how your chat interface looks"
            >
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="brandName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Company Name" {...field} />
                      </FormControl>
                      <FormDescription>
                        The name displayed in your chat interface
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/logo.png" {...field} />
                      </FormControl>
                      <FormDescription>
                        URL to your company logo
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="primaryColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Color</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input type="color" className="w-16 h-10 p-1" {...field} />
                            <Input placeholder="#3B82F6" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="secondaryColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Secondary Color</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input type="color" className="w-16 h-10 p-1" {...field} />
                            <Input placeholder="#F3F4F6" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="welcomeMessage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Welcome Message</FormLabel>
                      <FormControl>
                        <Input placeholder="Hello! How can I help you today?" {...field} />
                      </FormControl>
                      <FormDescription>
                        The first message users see
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="placeholderText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Input Placeholder</FormLabel>
                      <FormControl>
                        <Input placeholder="Type your message..." {...field} />
                      </FormControl>
                      <FormDescription>
                        Placeholder text for the message input
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </DashboardSection>

            {/* Actions */}
            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Creating...' : 'Create Chat Interface'}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* Preview */}
      {showPreview && (
        <div className="lg:sticky lg:top-6">
          <DashboardSection
            title="Live Preview"
            description="See how your chat interface will look"
          >
            <ChatPreview config={watchedValues} />
          </DashboardSection>
        </div>
      )}
    </div>
  );
};