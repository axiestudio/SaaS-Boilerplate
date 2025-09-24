/**
 * API Configuration Utilities
 * Handles environment variables and default API settings
 */

export interface DefaultApiConfig {
  endpoint?: string;
  apiKey?: string;
  authMethod: 'header' | 'bearer' | 'query' | 'body';
  format: string;
}

/**
 * Get default API configuration from environment variables
 */
export function getDefaultApiConfig(): DefaultApiConfig {
  return {
    endpoint: process.env.DEFAULT_API_ENDPOINT || '',
    apiKey: process.env.DEFAULT_API_KEY || '',
    authMethod: (process.env.DEFAULT_API_AUTH_METHOD as any) || 'header',
    format: process.env.DEFAULT_API_FORMAT || 'generic',
  };
}

/**
 * Check if demo mode is enabled
 */
export function isDemoModeEnabled(): boolean {
  return process.env.ENABLE_DEMO_MODE === 'true';
}

/**
 * Get demo API key
 */
export function getDemoApiKey(): string {
  return process.env.DEMO_API_KEY || 'demo-api-key-12345';
}

/**
 * Get suggested API endpoints for different providers
 */
export function getSuggestedEndpoints(): Record<string, { name: string; endpoint: string; format: string; authMethod: string; example: string }> {
  return {
    langflow: {
      name: 'Langflow/AstraDB DataStax',
      endpoint: 'https://api.langflow.astra.datastax.com/lf/[FLOW_ID]/api/v1/run/[ENDPOINT_ID]',
      format: 'langflow',
      authMethod: 'bearer',
      example: 'https://api.langflow.astra.datastax.com/lf/2a3b4a7f-46fc-48b0-b72f-7f554cc134e5/api/v1/run/f570a079-331f-4074-b904-66fd87611f0d'
    },
    axie: {
      name: 'Axie Studio Flow',
      endpoint: 'https://se.axiestudio.se/api/v1/run/[FLOW_ID]',
      format: 'axie',
      authMethod: 'header',
      example: 'https://se.axiestudio.se/api/v1/run/f367b850-4b93-47a2-9cc2-b6562a674ba4'
    },
    openai: {
      name: 'OpenAI ChatGPT',
      endpoint: 'https://api.openai.com/v1/chat/completions',
      format: 'openai',
      authMethod: 'bearer',
      example: 'https://api.openai.com/v1/chat/completions'
    },
    anthropic: {
      name: 'Anthropic Claude',
      endpoint: 'https://api.anthropic.com/v1/messages',
      format: 'anthropic',
      authMethod: 'header',
      example: 'https://api.anthropic.com/v1/messages'
    },
    cohere: {
      name: 'Cohere',
      endpoint: 'https://api.cohere.ai/v1/generate',
      format: 'cohere',
      authMethod: 'bearer',
      example: 'https://api.cohere.ai/v1/generate'
    },
    custom: {
      name: 'Custom API',
      endpoint: 'https://your-api-endpoint.com/chat',
      format: 'generic',
      authMethod: 'header',
      example: 'https://your-api-endpoint.com/chat'
    }
  };
}

/**
 * Validate API configuration
 */
export function validateApiConfig(endpoint: string, apiKey: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!endpoint) {
    errors.push('API endpoint is required');
  } else {
    try {
      new URL(endpoint);
    } catch {
      errors.push('API endpoint must be a valid URL');
    }
  }

  if (!apiKey) {
    errors.push('API key is required');
  } else if (apiKey.length < 10) {
    errors.push('API key seems too short (minimum 10 characters)');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Get API configuration with fallbacks
 */
export function getApiConfigWithFallbacks(userEndpoint?: string, userApiKey?: string): {
  endpoint: string;
  apiKey: string;
  hasDefaults: boolean;
} {
  const defaults = getDefaultApiConfig();
  
  return {
    endpoint: userEndpoint || defaults.endpoint || '',
    apiKey: userApiKey || defaults.apiKey || '',
    hasDefaults: !!(defaults.endpoint && defaults.apiKey)
  };
}
