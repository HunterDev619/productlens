import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './libs/I18nRouting';

const handleI18nRouting = createMiddleware(routing);

export default async function middleware(
  request: NextRequest,
) {
  // Temporarily disable Arcjet to reduce middleware bundle size for deployment
  // TODO: Re-enable Arcjet protection after optimizing bundle size
  /*
  if (process.env.ARCJET_KEY) {
    try {
      // Dynamic import to reduce middleware bundle size
      const { detectBot } = await import('@arcjet/next');
      const arcjet = (await import('@/libs/Arcjet')).default;
      const aj = arcjet.withRule(
        detectBot({
          mode: 'LIVE',
          // Block all bots except the following
          allow: [
            // See https://docs.arcjet.com/bot-protection/identifying-bots
            'CATEGORY:SEARCH_ENGINE', // Allow search engines
            'CATEGORY:PREVIEW', // Allow preview links to show OG images
            'CATEGORY:MONITOR', // Allow uptime monitoring services
          ],
        }),
      );

      const decision = await aj.protect(request);

      if (decision.isDenied()) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    } catch (error) {
      // If Arcjet fails, continue with the request
      console.warn('Arcjet protection failed:', error);
    }
  }
  */
// this is the middleware for the i18n routing
  return handleI18nRouting(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/_next`, `/_vercel` or `monitoring`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!_next|_vercel|monitoring|.*\\..*).*)',
};
