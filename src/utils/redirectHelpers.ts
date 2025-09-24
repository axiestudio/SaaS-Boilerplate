import { NextResponse } from 'next/server';

/**
 * Helper function to create redirect responses for API routes
 * when users try to access resources they don't own
 */
export function createAccessDeniedResponse(locale?: string) {
  const localePrefix = locale && locale !== 'en' ? `/${locale}` : '';
  const redirectUrl = `${localePrefix}/dashboard/chat-interfaces/access-denied`;
  
  return NextResponse.json(
    {
      error: 'Access denied',
      message: 'You do not have permission to access this resource.',
      redirectUrl,
      statusCode: 403
    },
    { status: 403 }
  );
}

/**
 * Helper function to create unauthorized responses
 */
export function createUnauthorizedResponse(locale?: string) {
  const localePrefix = locale && locale !== 'en' ? `/${locale}` : '';
  const redirectUrl = `${localePrefix}/sign-in`;
  
  return NextResponse.json(
    {
      error: 'Unauthorized',
      message: 'You must be logged in to access this resource.',
      redirectUrl,
      statusCode: 401
    },
    { status: 401 }
  );
}

/**
 * Helper function to create not found responses
 */
export function createNotFoundResponse() {
  return NextResponse.json(
    {
      error: 'Not found',
      message: 'The requested resource was not found.',
      statusCode: 404
    },
    { status: 404 }
  );
}

/**
 * Extract locale from request headers or URL
 */
export function extractLocaleFromRequest(request: Request): string {
  // Try to get locale from Accept-Language header or URL
  const url = new URL(request.url);
  const pathSegments = url.pathname.split('/');
  
  // Check if first segment is a locale
  const possibleLocale = pathSegments[1];
  if (possibleLocale && ['en', 'sv', 'fr'].includes(possibleLocale)) {
    return possibleLocale;
  }
  
  return 'en'; // Default locale
}
