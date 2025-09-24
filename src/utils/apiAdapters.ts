/**
 * Flexible API Adapter System
 * Supports ANY API endpoint with different authentication methods and request formats
 */

export interface ApiConfig {
  endpoint: string;
  apiKey: string;
  authMethod: 'header' | 'bearer' | 'query' | 'body';
  requestFormat: 'axie' | 'langflow' | 'openai' | 'anthropic' | 'cohere' | 'generic' | 'custom';
  customHeaders?: Record<string, string>;
  customPayload?: Record<string, any>;
}

export interface ApiRequest {
  message: string;
  sessionId: string;
  config: ApiConfig;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Detect API type from endpoint URL
 */
export function detectApiType(endpoint: string): string {
  const url = endpoint.toLowerCase();

  if (url.includes('openai.com') || url.includes('api.openai.com')) {
    return 'openai';
  }
  if (url.includes('astra') || url.includes('datastax') || url.includes('langflow')) {
    return 'langflow';
  }
  if (url.includes('axiestudio.se') || url.includes('se.axiestudio.se')) {
    return 'axie';
  }
  if (url.includes('anthropic.com') || url.includes('claude')) {
    return 'anthropic';
  }
  if (url.includes('cohere.ai') || url.includes('cohere.com')) {
    return 'cohere';
  }

  return 'generic';
}

/**
 * Build request headers based on authentication method
 */
export function buildHeaders(config: ApiConfig): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  };

  // Add authentication based on method and API type
  switch (config.authMethod) {
    case 'header':
      // For Axie Studio and similar APIs that use x-api-key
      headers['x-api-key'] = config.apiKey;
      break;
    case 'bearer':
      // For Langflow/AstraDB, OpenAI, and similar APIs that use Bearer token
      headers['Authorization'] = `Bearer ${config.apiKey}`;
      break;
    // query and body auth handled in buildPayload and URL construction
  }

  // Add custom headers
  if (config.customHeaders) {
    Object.assign(headers, config.customHeaders);
  }

  return headers;
}

/**
 * Build request payload based on API format
 */
export function buildPayload(request: ApiRequest): any {
  const { message, sessionId, config } = request;

  switch (config.requestFormat) {
    case 'axie':
      // Axie Studio format: output_type first, then input_type, then input_value
      return {
        output_type: 'chat',
        input_type: 'chat',
        input_value: message,
        session_id: sessionId,
        ...config.customPayload,
      };

    case 'langflow':
      // Langflow/AstraDB format: input_value first, then output_type, then input_type
      return {
        input_value: message,
        output_type: 'chat',
        input_type: 'chat',
        session_id: sessionId,
        ...config.customPayload,
      };

    case 'openai':
      return {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'user', content: message }
        ],
        max_tokens: 1000,
        temperature: 0.7,
        ...config.customPayload,
      };

    case 'anthropic':
      return {
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [
          { role: 'user', content: message }
        ],
        ...config.customPayload,
      };

    case 'cohere':
      return {
        prompt: message,
        max_tokens: 1000,
        temperature: 0.7,
        ...config.customPayload,
      };

    case 'generic':
      return {
        message,
        session_id: sessionId,
        ...config.customPayload,
      };

    case 'custom':
      return {
        ...config.customPayload,
        message,
        sessionId,
      };

    default:
      return {
        input: message,
        session: sessionId,
        ...config.customPayload,
      };
  }
}

/**
 * Parse API response based on format
 */
export function parseResponse(response: any, format: string): string {
  try {
    switch (format) {
      case 'axie':
        // Axie Studio response parsing - try multiple possible paths
        return response?.outputs?.[0]?.outputs?.[0]?.results?.message?.text ||
               response?.outputs?.[0]?.outputs?.[0]?.messages?.[0]?.message ||
               response?.output?.text ||
               response?.text ||
               response?.message ||
               'No response received';

      case 'langflow':
        // Langflow/AstraDB response parsing
        return response?.outputs?.[0]?.outputs?.[0]?.results?.message?.text ||
               response?.outputs?.[0]?.outputs?.[0]?.artifacts?.message ||
               response?.output ||
               response?.result ||
               response?.text ||
               response?.message ||
               'No response received';

      case 'openai':
        return response?.choices?.[0]?.message?.content || 'No response received';

      case 'anthropic':
        return response?.content?.[0]?.text || response?.completion || 'No response received';

      case 'cohere':
        return response?.generations?.[0]?.text || response?.text || 'No response received';

      case 'generic':
        return response?.response || response?.output || response?.text || response?.message || 'No response received';

      default:
        // Try common response fields in order of likelihood
        return response?.outputs?.[0]?.outputs?.[0]?.results?.message?.text ||
               response?.outputs?.[0]?.outputs?.[0]?.messages?.[0]?.message ||
               response?.choices?.[0]?.message?.content ||
               response?.content?.[0]?.text ||
               response?.generations?.[0]?.text ||
               response?.output ||
               response?.response ||
               response?.text ||
               response?.message ||
               response?.result ||
               'No response received';
    }
  } catch (error) {
    console.error('Error parsing API response:', error);
    return 'Error parsing response';
  }
}

/**
 * Make flexible API call
 */
export async function makeApiCall(request: ApiRequest): Promise<ApiResponse> {
  try {
    const headers = buildHeaders(request.config);
    const payload = buildPayload(request);
    
    console.log('🚀 Making API call to:', request.config.endpoint);
    console.log('🔧 Request format:', request.config.requestFormat);
    console.log('🔑 Auth method:', request.config.authMethod);
    console.log('📝 Payload:', payload);

    // Handle query parameter authentication
    let url = request.config.endpoint;
    if (request.config.authMethod === 'query') {
      const separator = url.includes('?') ? '&' : '?';
      url += `${separator}api_key=${encodeURIComponent(request.config.apiKey)}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      return {
        success: false,
        error: `API Error (${response.status}): ${errorText}`,
      };
    }

    const responseData = await response.json();
    console.log('✅ API Response:', responseData);

    const parsedMessage = parseResponse(responseData, request.config.requestFormat);

    return {
      success: true,
      message: parsedMessage,
    };

  } catch (error) {
    console.error('API Call Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown API error',
    };
  }
}
