'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Save, Eye, TestTube, Wand2, Globe, Lock } from 'lucide-react';
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
  fontFamily: z.string().min(1, 'Font family is required'),
  textColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
  botMessageColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
  userMessageColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
  welcomeMessage: z.string().min(1, 'Welcome message is required').max(200, 'Welcome message must be less than 200 characters'),
  placeholderText: z.string().min(1, 'Placeholder text is required').max(100, 'Placeholder text must be less than 100 characters'),
  isActive: z.boolean().default(true),
});

type ChatInterfaceFormData = z.infer<typeof chatInterfaceSchema>;

export const ChatInterfaceForm = ({ initialData, isEditing = false }: {
  initialData?: Partial<ChatInterfaceFormData & { id?: number }>;
  isEditing?: boolean;
}) => {
  const { userId } = useAuth();
  const router = useRouter();
  const [showPreview, setShowPreview] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [publicUrl, setPublicUrl] = useState('');

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
      fontFamily: initialData?.fontFamily || 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      textColor: initialData?.textColor || '#1F2937',
      botMessageColor: initialData?.botMessageColor || '#F9FAFB',
      userMessageColor: initialData?.userMessageColor || '#3B82F6',
      welcomeMessage: initialData?.welcomeMessage || 'Hello! How can I help you today?',
      placeholderText: initialData?.placeholderText || 'Type your message...',
      isActive: initialData?.isActive ?? true,
    },
  });

  // Watch all form values for real-time preview updates
  const watchedValues = form.watch();

  // Update public URL when slug changes
  useEffect(() => {
    const slug = watchedValues.slug;
    if (slug) {
      setPublicUrl(`${window.location.origin}/chat/${slug}`);
    }
  }, [watchedValues.slug]);

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

  const togglePublicAccess = async () => {
    if (!isEditing || !initialData?.id) return;
    
    const newStatus = !form.getValues('isActive');
    
    try {
      const response = await fetch(`/api/chat-interfaces/${initialData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: newStatus,
        }),
      });

      if (response.ok) {
        form.setValue('isActive', newStatus);
        alert(`✅ Chat interface is now ${newStatus ? 'public' : 'private'}`);
      } else {
        alert('❌ Failed to update public access status');
      }
    } catch (error) {
      console.error('Error toggling public access:', error);
      alert('❌ Failed to update public access status');
    }
  };

  const onSubmit = async (data: ChatInterfaceFormData) => {
    setIsSubmitting(true);
    try {
      const url = isEditing && initialData?.id
        ? `/api/chat-interfaces/${initialData.id}` 
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
        
        // Show success message
        const action = isEditing ? 'updated' : 'created';
        alert(`✅ Chat interface ${action} successfully!`);
        
        if (!isEditing) {
          // Redirect to edit page after creation
          router.push(`/dashboard/chat-interfaces/${result.id}/edit`);
        } else {
          // Refresh the page to show updated data
          window.location.reload();
        }
      } else {
        const error = await response.json();
        alert(`❌ Error: ${error.error || 'Something went wrong'}`);
      }
    } catch (error) {
      console.error('Error saving chat interface:', error);
      alert('❌ Error saving chat interface. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyPublicUrl = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      alert('✅ Public URL copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy URL:', error);
      alert('❌ Failed to copy URL');
    }
  };

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

              {/* Public URL Display and Copy */}
              {publicUrl && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Public Chat URL</Label>
                      <p className="text-sm text-muted-foreground break-all">{publicUrl}</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={copyPublicUrl}
                    >
                      Copy URL
                    </Button>
                  </div>
                </div>
              )}

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

            {/* Public Access Control */}
            <DashboardSection
              title="Public Access"
              description="Control whether your chat interface is publicly accessible"
            >
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {field.value ? (
                          <Globe className="h-5 w-5 text-green-600" />
                        ) : (
                          <Lock className="h-5 w-5 text-red-600" />
                        )}
                        <div>
                          <FormLabel className="text-base font-medium">
                            {field.value ? 'Public Access Enabled' : 'Public Access Disabled'}
                          </FormLabel>
                          <FormDescription>
                            {field.value 
                              ? 'Your chat interface is publicly accessible via the URL above'
                              : 'Your chat interface is private and not accessible to the public'
                            }
                          </FormDescription>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant={field.value ? "destructive" : "default"}
                        onClick={togglePublicAccess}
                        disabled={!isEditing}
                      >
                        {field.value ? 'Make Private' : 'Make Public'}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
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

              {/* Typography & Colors Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Typography & Advanced Colors</h3>

                <FormField
                  control={form.control}
                  name="fontFamily"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Font Family *</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">Inter (Modern)</option>
                          <option value="'Helvetica Neue', Helvetica, Arial, sans-serif">Helvetica</option>
                          <option value="'Times New Roman', Times, serif">Times New Roman</option>
                          <option value="Georgia, serif">Georgia</option>
                          <option value="'Courier New', Courier, monospace">Courier New</option>
                          <option value="'Arial Black', Arial, sans-serif">Arial Black</option>
                          <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
                          <option value="Verdana, sans-serif">Verdana</option>
                          <option value="'Comic Sans MS', cursive">Comic Sans MS</option>
                          <option value="Impact, sans-serif">Impact</option>
                        </select>
                      </FormControl>
                      <FormDescription>
                        Choose the font family for your chat interface
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="textColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Text Color *</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input type="color" className="w-16 h-10 p-1 rounded" {...field} />
                            <Input placeholder="#1F2937" {...field} />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Main text color
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="botMessageColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bot Message Color *</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input type="color" className="w-16 h-10 p-1 rounded" {...field} />
                            <Input placeholder="#F9FAFB" {...field} />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Bot message background
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="userMessageColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>User Message Color *</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input type="color" className="w-16 h-10 p-1 rounded" {...field} />
                            <Input placeholder="#3B82F6" {...field} />
                          </div>
                        </FormControl>
                        <FormDescription>
                          User message background
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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

              {publicUrl && watchedValues.isActive && (
                <Button 
                  type="button" 
                  variant="secondary" 
                  size="lg"
                  onClick={() => window.open(publicUrl, '_blank')}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Open Public Chat
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>

      {/* Live Preview - Takes 1/3 width on xl screens */}
      {showPreview && (
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
      )}
    </div>
  );
};