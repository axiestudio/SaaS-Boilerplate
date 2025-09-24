'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { Save, Eye, TestTube, Wand2, Globe, Lock, Sparkles, Palette, Settings, Link as LinkIcon, MessageSquare, EyeOff } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full max-w-none mx-auto">
        {/* Enhanced Form Section - Takes 3/5 width on xl screens */}
        <div className="space-y-6 overflow-y-auto max-h-screen">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Hero Section */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border border-primary/20 p-6">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-pulse" />
                <div className="relative">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        {isEditing ? 'Customize Your Chat Interface' : 'Create Your Chat Interface'}
                      </h1>
                      <p className="text-sm text-muted-foreground">
                        {isEditing ? 'Update your chat interface settings and branding' : 'Build a professional chat experience for your customers'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Basic Configuration Section */}
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Settings className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{t('basic_config')}</h2>
                    <p className="text-sm text-muted-foreground">{t('basic_config_description')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-primary" />
                          {t('name')} *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={t('name_placeholder')} 
                            {...field} 
                            className="h-10 text-sm border-2 focus:border-primary/50 transition-all duration-200"
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
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
                        <FormLabel className="text-sm font-semibold flex items-center gap-2">
                          <LinkIcon className="h-4 w-4 text-primary" />
                          {t('slug')} *
                        </FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input 
                              placeholder={t('slug_placeholder')} 
                              {...field} 
                              className="h-10 text-sm border-2 focus:border-primary/50 transition-all duration-200"
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={generateSlug}
                            disabled={!form.getValues('name')}
                            className="h-10 px-3 border-2 hover:border-primary/50 transition-all duration-200"
                          >
                            <Wand2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <FormDescription className="text-xs">
                          {t('slug_description')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Enhanced Public URL Display */}
                {publicUrl && (
                  <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200/50 p-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5" />
                    <div className="relative">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <Label className="text-sm font-semibold text-green-800 flex items-center gap-2 mb-2">
                            <Globe className="h-4 w-4" />
                            {t('public_chat_url')}
                          </Label>
                          <p className="text-xs text-green-700 break-all font-mono bg-white/50 px-2 py-1 rounded border border-green-200">
                            {publicUrl}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={copyPublicUrl}
                          className="ml-3 h-8 border-2 border-green-300 text-green-700 hover:bg-green-100 hover:border-green-400 transition-all duration-200"
                        >
                          {t('copy_url')}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="apiEndpoint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">{t('api_endpoint')} *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={t('api_endpoint_placeholder')} 
                          {...field} 
                          className="h-10 text-sm border-2 focus:border-primary/50 transition-all duration-200"
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        {t('api_endpoint_description')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  <div className="lg:col-span-3 space-y-2">
                    <FormField
                      control={form.control}
                      name="apiKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold">{t('api_key')} *</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder={t('api_key_placeholder')} 
                              {...field} 
                              className="h-10 text-sm border-2 focus:border-primary/50 transition-all duration-200"
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
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
                      className="w-full h-10 border-2 hover:border-primary/50 transition-all duration-200"
                    >
                      <TestTube className="h-4 w-4 mr-2" />
                      {isTesting ? 'Testing...' : t('test_connection')}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Public Access Control Section */}
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Globe className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{t('public_access')}</h2>
                    <p className="text-sm text-muted-foreground">{t('public_access_description')}</p>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem>
                      <div className="relative overflow-hidden rounded-xl border-2 border-border/50 bg-gradient-to-r from-card to-card/80 p-4 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                              field.value 
                                ? 'bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg shadow-green-500/25' 
                                : 'bg-gradient-to-br from-red-500 to-pink-500 shadow-lg shadow-red-500/25'
                            }`}>
                              {field.value ? (
                                <Globe className="h-5 w-5 text-white" />
                              ) : (
                                <Lock className="h-5 w-5 text-white" />
                              )}
                            </div>
                            <div>
                              <FormLabel className="text-base font-semibold">
                                {field.value ? t('public_access_enabled') : t('public_access_disabled')}
                              </FormLabel>
                              <FormDescription className="text-xs mt-1">
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
                            className="h-10 px-4 text-sm font-semibold transition-all duration-200"
                          >
                            {field.value ? t('make_private') : 'Make Public'}
                          </Button>
                        </div>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {/* Enhanced Branding Section */}
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <Palette className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{t('branding')}</h2>
                    <p className="text-sm text-muted-foreground">{t('branding_description')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="brandName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">{t('brand_name')} *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={t('brand_name_placeholder')} 
                            {...field} 
                            className="h-10 text-sm border-2 focus:border-primary/50 transition-all duration-200"
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
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
                        <FormLabel className="text-sm font-semibold">{t('logo_url')} (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={t('logo_url_placeholder')} 
                            {...field} 
                            className="h-10 text-sm border-2 focus:border-primary/50 transition-all duration-200"
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          {t('logo_url_description')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Enhanced Color Pickers */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="primaryColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">{t('primary_color')} *</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <div className="relative">
                              <Input 
                                type="color" 
                                className="w-12 h-10 p-1 rounded-lg border-2 cursor-pointer hover:scale-105 transition-transform duration-200" 
                                {...field} 
                              />
                              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                            </div>
                            <Input 
                              placeholder={t('primary_color_placeholder')} 
                              {...field} 
                              className="flex-1 h-10 text-sm border-2 focus:border-primary/50 transition-all duration-200"
                            />
                          </div>
                        </FormControl>
                        <FormDescription className="text-xs">
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
                        <FormLabel className="text-sm font-semibold">{t('secondary_color')} *</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <div className="relative">
                              <Input 
                                type="color" 
                                className="w-12 h-10 p-1 rounded-lg border-2 cursor-pointer hover:scale-105 transition-transform duration-200" 
                                {...field} 
                              />
                              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                            </div>
                            <Input 
                              placeholder={t('secondary_color_placeholder')} 
                              {...field} 
                              className="flex-1 h-10 text-sm border-2 focus:border-primary/50 transition-all duration-200"
                            />
                          </div>
                        </FormControl>
                        <FormDescription className="text-xs">
                          {t('secondary_color_description')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Enhanced Typography Section */}
                <div className="space-y-4 pt-4 border-t border-border/30">
                  <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary" />
                    {t('typography_advanced_colors')}
                  </h3>

                  <FormField
                    control={form.control}
                    name="fontFamily"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">{t('font_family')} *</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="flex h-10 w-full rounded-lg border-2 border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
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
                        <FormDescription className="text-xs">
                          {t('font_family_description')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="textColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold">{t('text_color')} *</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <div className="relative">
                                <Input 
                                  type="color" 
                                  className="w-10 h-10 p-1 rounded-lg border-2 cursor-pointer hover:scale-105 transition-transform duration-200" 
                                  {...field} 
                                />
                                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                              </div>
                              <Input 
                                placeholder={t('text_color_placeholder')} 
                                {...field} 
                                className="flex-1 h-10 text-sm border-2 focus:border-primary/50 transition-all duration-200"
                              />
                            </div>
                          </FormControl>
                          <FormDescription className="text-xs">
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
                          <FormLabel className="text-sm font-semibold">{t('bot_message_color')} *</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <div className="relative">
                                <Input 
                                  type="color" 
                                  className="w-10 h-10 p-1 rounded-lg border-2 cursor-pointer hover:scale-105 transition-transform duration-200" 
                                  {...field} 
                                />
                                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                              </div>
                              <Input 
                                placeholder={t('bot_message_color_placeholder')} 
                                {...field} 
                                className="flex-1 h-10 text-sm border-2 focus:border-primary/50 transition-all duration-200"
                              />
                            </div>
                          </FormControl>
                          <FormDescription className="text-xs">
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
                          <FormLabel className="text-sm font-semibold">{t('user_message_color')} *</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <div className="relative">
                                <Input 
                                  type="color" 
                                  className="w-10 h-10 p-1 rounded-lg border-2 cursor-pointer hover:scale-105 transition-transform duration-200" 
                                  {...field} 
                                />
                                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                              </div>
                              <Input 
                                placeholder={t('user_message_color_placeholder')} 
                                {...field} 
                                className="flex-1 h-10 text-sm border-2 focus:border-primary/50 transition-all duration-200"
                              />
                            </div>
                          </FormControl>
                          <FormDescription className="text-xs">
                            {t('user_message_color_description')}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="welcomeMessage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">{t('welcome_message')} *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={t('welcome_message_placeholder')} 
                            {...field} 
                            className="h-10 text-sm border-2 focus:border-primary/50 transition-all duration-200"
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
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
                        <FormLabel className="text-sm font-semibold">{t('placeholder_text')} *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('placeholder_text_placeholder')}
                            {...field}
                            className="h-10 text-sm border-2 focus:border-primary/50 transition-all duration-200"
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          {t('placeholder_text_description')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
                <div className="flex flex-wrap gap-4">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="h-12 px-6 text-sm font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    {isSubmitting 
                      ? (isEditing ? 'Updating...' : 'Creating...') 
                      : (isEditing ? t('update_interface') : t('create_interface'))
                    }
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowPreview(!showPreview)}
                    className="h-12 px-6 text-sm font-semibold border-2 hover:border-primary/50 transition-all duration-300"
                  >
                    {showPreview ? <EyeOff className="h-5 w-5 mr-2" /> : <Eye className="h-5 w-5 mr-2" />}
                    {showPreview ? t('hide_preview') : t('show_preview')}
                  </Button>

                  {publicUrl && watchedValues.isActive && (
                    <Button 
                      type="button" 
                      variant="secondary" 
                      onClick={() => window.open(publicUrl, '_blank')}
                      className="h-12 px-6 text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Globe className="h-5 w-5 mr-2" />
                      {t('open_public_chat')}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </div>

        {/* Enhanced Live Preview Section - Takes 2/5 width on xl screens */}
        {showPreview && (
          <div className="h-full">
            <div className="sticky top-4 h-[calc(100vh-2rem)]">
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Eye className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{t('live_preview_title')}</h2>
                    <p className="text-sm text-muted-foreground">{t('live_preview_description')}</p>
                  </div>
                </div>

                {/* Preview Container with Enhanced Styling */}
                <div className="relative flex-1 min-h-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-xl" />
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-xl p-4 border-2 border-border/30 h-full">
                    <ChatPreview config={watchedValues} />
                  </div>
                </div>

                {/* Preview Status Indicator */}
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>Live Preview - Updates in real-time</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};