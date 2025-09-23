'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@clerk/nextjs';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Save, Eye, TestTube, Wand2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  slug: z.string()
    .min(3, 'Slug must be at least 3 characters')
    .max(50, 'Slug must be less than 50 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  apiEndpoint: z.string().url('Must be a valid URL'),
  apiKey: z.string().min(1, 'API Key is required'),
  brandName: z.string().min(1, 'Brand name is required').max(50, 'Brand name must be less than 50 characters'),
  logoUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
  welcomeMessage: z.string().min(1, 'Welcome message is required').max(200, 'Welcome message must be less than 200 characters'),
  placeholderText: z.string().min(1, 'Placeholder text is required').max(100, 'Placeholder text must be less than 100 characters'),
});

type ChatInterfaceFormData = z.infer<typeof chatInterfaceSchema>;

export const ChatInterfaceForm = ({ initialData, isEditing = false }: {
  initialData?: Partial<ChatInterfaceFormData>;
  isEditing?: boolean;
}) => {
  const { userId } = useAuth();
  const router = useRouter();
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const form = useForm<ChatInterfaceFormData>({
    resolver: zodResolver(chatInterfaceSchema),
    defaultValues: {
      name: initialData?.name || '',
      slug: initialData?.slug || '',
      apiEndpoint: initialData?.apiEndpoint || 'https://flow.axiestudio.se/api/v1/run/',
      apiKey: initialData?.apiKey || '',
      brandName: initialData?.brandName || '',
      logoUrl: initialData?.logoUrl || '',
      primaryColor: initialData?.primaryColor || '#3B82F6',
      secondaryColor: initialData?.secondaryColor || '#F3F4F6',
      welcomeMessage: initialData?.welcomeMessage || 'Hello! How can I help you today?',
      placeholderText: initialData?.placeholderText || 'Type your message...',
    },
  });

  const generateSlug = () => {
    const name = form.getValues('name');
    if (name) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      form.setValue('slug', slug);
    }
  };

  const testConnection = async () => {
    setIsTesting(true);
    try {
      const { apiEndpoint, apiKey } = form.getValues();
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({
          output_type: 'chat',
          input_type: 'chat',
          input_value: 'Test connection',
          session_id: 'test-session',
        }),
      });

      if (response.ok) {
        alert('✅ Connection successful! Your API is working correctly.');
      } else {
        alert('❌ Connection failed. Please check your API endpoint and key.');
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      alert('❌ Connection failed. Please check your API endpoint and key.');
    } finally {
      setIsTesting(false);
    }
  };

  const onSubmit = async (data: ChatInterfaceFormData) => {
    setIsSubmitting(true);
    try {
      const url = isEditing 
        ? `/api/chat-interfaces/${initialData?.slug}` 
        : '/api/chat-interfaces';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          ownerId: userId,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`✅ Chat interface ${isEditing ? 'updated' : 'created'} successfully!`);
        
        if (!isEditing) {
          router.push('/dashboard');
        }
      } else {
        const error = await response.json();
        alert(`❌ Error: ${error.message || 'Something went wrong'}`);
      }
    } catch (error) {
      console.error('Error saving chat interface:', error);
      alert('❌ Error saving chat interface. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const watchedValues = form.watch();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Form - Takes 2/3 width on xl screens */}
      <div className="xl:col-span-2 space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Configuration */}
            <DashboardSection
              title="Basic Configuration"
              description="Configure your chat interface settings and API connection"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interface Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Customer Support Chat" {...field} />
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
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Slug *</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="customer-support-chat" {...field} />
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={generateSlug}
                          disabled={!form.getValues('name')}
                        >
                          <Wand2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormDescription>
                        Public URL: /chat/{field.value || 'your-slug'}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="apiEndpoint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Axie Studio API Endpoint *</FormLabel>
                    <FormControl>
                      <Input placeholder="https://flow.axiestudio.se/api/v1/run/your-flow-id" {...field} />
                    </FormControl>
                    <FormDescription>
                      Your complete Axie Studio flow API endpoint URL
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="apiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Key *</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Your Axie Studio API key" {...field} />
                        </FormControl>
                        <FormDescription>
                          Your Axie Studio API authentication key
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={testConnection}
                    disabled={isTesting || !form.getValues('apiEndpoint') || !form.getValues('apiKey')}
                    className="w-full"
                  >
                    <TestTube className="h-4 w-4 mr-2" />
                    {isTesting ? 'Testing...' : 'Test API'}
                  </Button>
                </div>
              </div>
            </DashboardSection>

            {/* Branding & Appearance */}
            <DashboardSection
              title="Branding & Appearance"
              description="Customize how your chat interface looks and feels"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="brandName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Company Support" {...field} />
                      </FormControl>
                      <FormDescription>
                        Displayed in the chat header
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
                        Company logo for chat header
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="primaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Color *</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input type="color" className="w-16 h-10 p-1 rounded" {...field} />
                          <Input placeholder="#3B82F6" {...field} />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Header and user message color
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="secondaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secondary Color *</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input type="color" className="w-16 h-10 p-1 rounded" {...field} />
                          <Input placeholder="#F3F4F6" {...field} />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Bot message background color
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="welcomeMessage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Welcome Message *</FormLabel>
                      <FormControl>
                        <Input placeholder="Hello! How can I help you today?" {...field} />
                      </FormControl>
                      <FormDescription>
                        First message customers see
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
                      <FormLabel>Input Placeholder *</FormLabel>
                      <FormControl>
                        <Input placeholder="Type your message..." {...field} />
                      </FormControl>
                      <FormDescription>
                        Placeholder for message input
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </DashboardSection>

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              <Button type="submit" disabled={isSubmitting} size="lg">
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting 
                  ? (isEditing ? 'Updating...' : 'Creating...') 
                  : (isEditing ? 'Update Interface' : 'Create Interface')
                }
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                size="lg"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* Preview - Takes 1/3 width on xl screens, full width on smaller screens */}
      <div className="xl:col-span-1">
        <div className="sticky top-6">
          <DashboardSection
            title="Live Preview"
            description="See how your chat interface will look"
          >
            <ChatPreview config={watchedValues} />
          </DashboardSection>
        </div>
      </div>
    </div>
  );
};