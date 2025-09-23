'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Save, TestTube } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const apiSettingsSchema = z.object({
  defaultApiEndpoint: z.string().url('Must be a valid URL'),
  defaultApiKey: z.string().min(1, 'API Key is required'),
});

type ApiSettingsFormData = z.infer<typeof apiSettingsSchema>;

export const ApiSettingsForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const form = useForm<ApiSettingsFormData>({
    resolver: zodResolver(apiSettingsSchema),
    defaultValues: {
      defaultApiEndpoint: 'https://flow.axiestudio.se/api/v1/run/',
      defaultApiKey: '',
    },
  });

  const onSubmit = async (data: ApiSettingsFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Save API settings
      console.log('Saving API settings:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const testConnection = async () => {
    setIsTesting(true);
    try {
      const values = form.getValues();
      // TODO: Test API connection
      console.log('Testing connection:', values);
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Connection test successful!');
    } catch (error) {
      console.error('Connection test failed:', error);
      alert('Connection test failed. Please check your settings.');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="defaultApiEndpoint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default API Endpoint</FormLabel>
              <FormControl>
                <Input placeholder="https://flow.axiestudio.se/api/v1/run/" {...field} />
              </FormControl>
              <FormDescription>
                Your default Axie Studio flow API endpoint base URL
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="defaultApiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default API Key</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Your default API key" {...field} />
              </FormControl>
              <FormDescription>
                Your default Axie Studio API key (can be overridden per chat interface)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={testConnection}
            disabled={isTesting}
          >
            <TestTube className="h-4 w-4 mr-2" />
            {isTesting ? 'Testing...' : 'Test Connection'}
          </Button>
        </div>
      </form>
    </Form>
  );
};