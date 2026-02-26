import { NextResponse } from 'next/server';

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY;

async function verifyRecaptcha(token: string): Promise<boolean> {
  if (!RECAPTCHA_SECRET) return false;
  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${RECAPTCHA_SECRET}&response=${token}`,
  });
  const data = await res.json();
  return data.success === true;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const token = formData.get('recaptcha_token');

  if (!token || typeof token !== 'string') {
    return NextResponse.json(
      { success: false, error: 'Please complete the reCAPTCHA verification' },
      { status: 400 },
    );
  }

  const valid = await verifyRecaptcha(token);
  if (!valid) {
    return NextResponse.json(
      { success: false, error: 'reCAPTCHA verification failed. Please try again.' },
      { status: 400 },
    );
  }

  // Form data available: name, email, company, country, reason, message
  const name = formData.get('name');
  const email = formData.get('email');
  const company = formData.get('company');
  const country = formData.get('country');
  const reason = formData.get('reason');
  const message = formData.get('message');

  // Extend here: send email, save to DB, etc.
  // For now, just acknowledge success
  return NextResponse.json({
    success: true,
    message: 'Thank you! We will be in touch soon.',
  });
}
