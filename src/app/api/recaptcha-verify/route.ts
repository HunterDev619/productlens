import { NextResponse } from 'next/server';

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY;

export async function POST(request: Request) {
  const { token } = await request.json();

  if (!token || typeof token !== 'string') {
    return NextResponse.json({ success: false, error: 'Missing reCAPTCHA token' }, { status: 400 });
  }

  if (!RECAPTCHA_SECRET) {
    return NextResponse.json(
      { success: false, error: 'reCAPTCHA not configured' },
      { status: 500 },
    );
  }

  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${RECAPTCHA_SECRET}&response=${token}`,
    });

    const data = await res.json();

    if (!data.success) {
      return NextResponse.json(
        { success: false, error: 'reCAPTCHA verification failed', details: data['error-codes'] },
        { status: 400 },
      );
    }

    // recaptcha verified
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: 'Verification request failed' },
      { status: 500 },
    );
  }
}
