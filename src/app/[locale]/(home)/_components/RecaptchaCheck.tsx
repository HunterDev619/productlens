'use client';

import { useRef, useCallback, useImperativeHandle, forwardRef } from 'react';
import ReCAPTCHA, { type ReCAPTCHAInstance } from 'react-google-recaptcha';

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export interface RecaptchaCheckHandle {
  reset: () => void;
}

export const RecaptchaCheck = forwardRef<RecaptchaCheckHandle>(function RecaptchaCheck(_, ref) {
  const recaptchaRef = useRef<ReCAPTCHAInstance | null>(null);

  useImperativeHandle(ref, () => ({
    reset: () => {
      recaptchaRef.current?.reset();
      const input = document.getElementById('recaptcha_token') as HTMLInputElement | null;
      if (input) input.value = '';
    },
  }));

  const onChange = useCallback(() => {
    const token = recaptchaRef.current?.getValue();
    const input = document.getElementById('recaptcha_token') as HTMLInputElement | null;
    if (input) input.value = token ?? '';
  }, []);

  const onExpired = useCallback(() => {
    const input = document.getElementById('recaptcha_token') as HTMLInputElement | null;
    if (input) input.value = '';
  }, []);

  if (!SITE_KEY) {
    return (
      <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
        reCAPTCHA not configured. Add NEXT_PUBLIC_RECAPTCHA_SITE_KEY to your environment.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={SITE_KEY}
        onChange={onChange}
        onExpired={onExpired}
        theme="light"
      />
      <input
        id="recaptcha_token"
        name="recaptcha_token"
        type="hidden"
      />
    </div>
  );
});
RecaptchaCheck.displayName = 'RecaptchaCheck';
