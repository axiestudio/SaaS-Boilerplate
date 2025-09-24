import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import {
  type NextFetchEvent,
  type NextRequest,
  NextResponse,
} from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { AllLocales, AppConfig } from './utils/AppConfig';

const intlMiddleware = createMiddleware({
  locales: AllLocales,
  localePrefix: AppConfig.localePrefix,
  defaultLocale: AppConfig.defaultLocale,
});

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/:locale/dashboard(.*)',
  '/onboarding(.*)',
  '/:locale/onboarding(.*)',
]);

export default function middleware(
  request: NextRequest,
  event: NextFetchEvent,
) {
  // Handle API routes separately - don't apply intl middleware to them
  // Let API routes handle their own authentication and return proper HTTP status codes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return clerkMiddleware()(request, event);
  }

  // Allow public chat interfaces to be accessed without authentication or internationalization
  if (request.nextUrl.pathname.startsWith('/chat/')) {
    return NextResponse.next();
  }

  if (
    request.nextUrl.pathname.includes('/sign-in')
    || request.nextUrl.pathname.includes('/sign-up')
    || isProtectedRoute(request)
  ) {
    return clerkMiddleware(async (auth, req) => {
      if (isProtectedRoute(req)) {
        const locale
          = req.nextUrl.pathname.match(/(\/.*)\/dashboard/)?.at(1) ?? '';

        const signInUrl = new URL(`${locale}/sign-in`, req.url);

        await auth.protect({
          // `unauthenticatedUrl` is needed to avoid error: "Unable to find `next-intl` locale because the middleware didn't run on this request"
          unauthenticatedUrl: signInUrl.toString(),
        });
      }

      const authObj = await auth();

      // Redirect to organization selection only for first-time users
      // Allow users to work with personal accounts (no orgId) after they've made a choice
      // Handle both localized and non-localized dashboard paths
      const isDashboardPath = req.nextUrl.pathname === '/dashboard' || req.nextUrl.pathname.match(/^\/[a-z]{2}\/dashboard$/);

      if (
        authObj.userId
        && !authObj.orgId
        && isDashboardPath
        && !req.nextUrl.searchParams.has('personal')
        && !req.nextUrl.searchParams.has('org_selected')
      ) {
        // Extract locale from path if present
        const locale = req.nextUrl.pathname.match(/^\/([a-z]{2})\//)?.at(1) ?? '';
        const localePrefix = locale ? `/${locale}` : '';

        const orgSelection = new URL(
          `${localePrefix}/onboarding/organization-selection`,
          req.url,
        );

        return NextResponse.redirect(orgSelection);
      }

      return intlMiddleware(req);
    })(request, event);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next|monitoring).*)', 
    '/', 
    '/(api|trpc)(.*)',
    '/chat/:path*' // Explicitly include chat routes
  ], // Also exclude tunnelRoute used in Sentry from the matcher
};
