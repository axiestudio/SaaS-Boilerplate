'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
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

const createChatInterfaceSchema = (t: any) => z.object({
  name: z.string().min(1, t('validation.name_required')).max(100, t('validation.name_max')),
  slug: z.string()
    .min(3, t('validation.slug_min'))
    .max(50, t('validation.slug_max'))
    .regex(/^[a-z0-9-]+$/, t('validation.slug_format')),
  apiEndpoint: z.string().url(t('validation.api_endpoint_url')),
  apiKey: z.string().min(1, t('validation.api_key_required')),
  brandName: z.string().min(1, t('validation.brand_name_required')).max(50, t('validation.brand_name_max')),
  logoUrl: z.string().url(t('validation.logo_url_format')).optional().or(z.literal('')),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, t('validation.color_format')),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, t('validation.color_format')),
  fontFamily: z.string().min(1, t('validation.font_family_required')),
  textColor: z.string().regex(/^#[0-9A-F]{6}$/i, t('validation.color_format')),
  botMessageColor: z.string().regex(/^#[0-9A-F]{6}$/i, t('validation.color_format')),
  userMessageColor: z.string().regex(/^#[0-9A-F]{6}$/i, t('validation.color_format')),
  welcomeMessage: z.string().min(1, t('validation.welcome_message_required')).max(200, t('validation.welcome_message_max')),
  placeholderText: z.string().min(1, t('validation.placeholder_text_required')).max(100, t('validation.placeholder_text_max')),
  isActive: z.boolean().default(true),
});

type ChatInterfaceFormData = z.infer<ReturnType<typeof createChatInterfaceSchema>>;

export const ChatInterfaceForm = ({ initialData, isEditing = false }: {
  initialData?: Partial<ChatInterfaceFormData & { id?: number }>;
  isEditing?: boolean;
}) => {
  const { userId } = useAuth();
  const router = useRouter();
  const t = useTranslations('ChatForm');
  const [showPreview, setShowPreview] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [publicUrl, setPublicUrl] = useState('');

  const form = useForm<ChatInterfaceFormData>({
    resolver: zodResolver(createChatInterfaceSchema(t)),
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
        alert(t('alerts.test_success'));
      } else {
        alert(t('alerts.test_error_generic'));
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      alert(t('alerts.test_error_generic'));
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
        const statusText = newStatus ? t('public_status') : t('private_status');
        alert(`✅ ${t('status_updated', { status: statusText })}`);
      } else {
        alert(t('alerts.status_update_failed'));
      }
    } catch (error) {
      console.error('Error toggling public access:', error);
      alert(t('alerts.status_update_failed'));
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
        alert(t('alerts.save_success'));

        if (!isEditing) {
          // Redirect to edit page after creation
          router.push(`/dashboard/chat-interfaces/${result.id}/edit`);
        } else {
          // Refresh the page to show updated data
          window.location.reload();
        }
      } else {
        const error = await response.json();
        alert(t('alerts.save_error', { error: error.error || 'Something went wrong' }));
      }
    } catch (error) {
      console.error('Error saving chat interface:', error);
      alert(t('alerts.save_error_generic'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyPublicUrl = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      alert(t('alerts.url_copied'));
    } catch (error) {
      console.error('Failed to copy URL:', error);
      alert(t('alerts.url_copy_failed'));
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
              title={t('basic_config')}
              description={t('basic_config_description')}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('name')} *</FormLabel>
                      <FormControl>
                        <Input placeholder={t('name_placeholder')} {...field} />
                      </FormControl>
                      <FormDescription>
                        {t('name_description')}
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
                      <FormLabel>{t('slug')} *</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder={t('slug_placeholder')} {...field} />
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
                        {t('slug_description')}
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
                      <Label className="text-sm font-medium">{t('public_chat_url')}</Label>
                      <p className="text-sm text-muted-foreground break-all">{publicUrl}</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={copyPublicUrl}
                    >
                      {t('copy_url')}
                    </Button>
                  </div>
                </div>
              )}

              <FormField
                control={form.control}
                name="apiEndpoint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('api_endpoint')} *</FormLabel>
                    <FormControl>
                      <Input placeholder={t('api_endpoint_placeholder')} {...field} />
                    </FormControl>
                    <FormDescription>
                      {t('api_endpoint_description')}
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
                        <FormLabel>{t('api_key')} *</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder={t('api_key_placeholder')} {...field} />
                        </FormControl>
                        <FormDescription>
                          {t('api_key_description')}
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
                    {isTesting ? 'Testing...' : t('test_connection')}
                  </Button>
                </div>
              </div>
            </DashboardSection>

            {/* Public Access Control */}
            <DashboardSection
              title={t('public_access')}
              description={t('public_access_description')}
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
                            {field.value ? t('public_access_enabled') : t('public_access_disabled')}
                          </FormLabel>
                          <FormDescription>
                            {field.value 
                              ? t('public_access_enabled_description')
                              : t('public_access_disabled_description')
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
                        {field.value ? t('make_private') : t('make_public')}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </DashboardSection>

            {/* Branding & Appearance */}
            <DashboardSection
              title={t('branding')}
              description={t('branding_description')}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="brandName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('brand_name')} *</FormLabel>
                      <FormControl>
                        <Input placeholder={t('brand_name_placeholder')} {...field} />
                      </FormControl>
                      <FormDescription>
                        {t('brand_name_description')}
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
                      <FormLabel>{t('logo_url')} (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder={t('logo_url_placeholder')} {...field} />
                      </FormControl>
                      <FormDescription>
                        {t('logo_url_description')}
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
                      <FormLabel>{t('primary_color')} *</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input type="color" className="w-16 h-10 p-1 rounded" {...field} />
                          <Input placeholder={t('primary_color_placeholder')} {...field} />
                        </div>
                      </FormControl>
                      <FormDescription>
                        {t('primary_color_description')}
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
                      <FormLabel>{t('secondary_color')} *</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input type="color" className="w-16 h-10 p-1 rounded" {...field} />
                          <Input placeholder={t('secondary_color_placeholder')} {...field} />
                        </div>
                      </FormControl>
                      <FormDescription>
                        {t('secondary_color_description')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Typography & Colors Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">{t('typography_advanced_colors')}</h3>

                <FormField
                  control={form.control}
                  name="fontFamily"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('font_family')} *</FormLabel>
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
                        {t('font_family_description')}
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
                        <FormLabel>{t('text_color')} *</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input type="color" className="w-16 h-10 p-1 rounded" {...field} />
                            <Input placeholder={t('text_color_placeholder')} {...field} />
                          </div>
                        </FormControl>
                        <FormDescription>
                          {t('text_color_description')}
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
                        <FormLabel>{t('bot_message_color')} *</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input type="color" className="w-16 h-10 p-1 rounded" {...field} />
                            <Input placeholder={t('bot_message_color_placeholder')} {...field} />
                          </div>
                        </FormControl>
                        <FormDescription>
                          {t('bot_message_color_description')}
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
                        <FormLabel>{t('user_message_color')} *</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input type="color" className="w-16 h-10 p-1 rounded" {...field} />
                            <Input placeholder={t('user_message_color_placeholder')} {...field} />
                          </div>
                        </FormControl>
                        <FormDescription>
                          {t('user_message_color_description')}
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
                      <FormLabel>{t('welcome_message')} *</FormLabel>
                      <FormControl>
                        <Input placeholder={t('welcome_message_placeholder')} {...field} />
                      </FormControl>
                      <FormDescription>
                        {t('welcome_message_description')}
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
                      <FormLabel>{t('input_placeholder')} *</FormLabel>
                      <FormControl>
                        <Input placeholder={t('input_placeholder_placeholder')} {...field} />
                      </FormControl>
                      <FormDescription>
                        {t('input_placeholder_description')}
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
                  : (isEditing ? t('update_interface') : t('create_interface'))
                }
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                size="lg"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {showPreview ? t('hide_preview') : t('show_preview')}
              </Button>

              {publicUrl && watchedValues.isActive && (
                <Button 
                  type="button" 
                  variant="secondary" 
                  size="lg"
                  onClick={() => window.open(publicUrl, '_blank')}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  {t('open_public_chat')}
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
              title={t('live_preview_title')}
              description={t('live_preview_description')}
            >
              <ChatPreview config={watchedValues} />
            </DashboardSection>
          </div>
        </div>
      )}
    </div>
  );
};