import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  // Extract URL with hash fragment
  const url = new URL(request.url);
  
  // Redirect to the localized version, preserving hash and query params
  const locale = 'en'; // Default locale
  const redirectUrl = `/${locale}/auth/callback${url.search}${url.hash}`;
  
  redirect(redirectUrl);
}
