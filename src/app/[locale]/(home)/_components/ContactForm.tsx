'use client';

import { useState, useRef } from 'react';
import { RecaptchaCheck, type RecaptchaCheckHandle } from './RecaptchaCheck';

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const recaptchaRef = useRef<RecaptchaCheckHandle>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const tokenInput = document.getElementById('recaptcha_token') as HTMLInputElement | null;
    const token = tokenInput?.value ?? '';

    if (!token) {
      setStatus('error');
      setErrorMsg('Please complete the reCAPTCHA verification.');
      return;
    }

    setStatus('submitting');
    setErrorMsg('');

    try {
      const formData = new FormData(form);
      const res = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setErrorMsg(data.error ?? 'Something went wrong. Please try again.');
        return;
      }

      setStatus('success');
      form.reset();
      recaptchaRef.current?.reset();
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please try again.');
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Name<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          required
          placeholder="Enter your name"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Work E-mail<span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          required
          placeholder="Input your Email"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Company<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="company"
            required
            placeholder="Enter your company name"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Country<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="country"
            required
            placeholder="Select your country"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          What brings you to us today?<span className="text-red-500">*</span>
        </label>
        <select
          name="reason"
          required
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          defaultValue=""
        >
          <option value="" disabled>
            Choose what you're looking for?
          </option>
          <option value="demo">Book a product demo</option>
          <option value="pricing">Ask about pricing</option>
          <option value="partnership">Discuss partnership</option>
          <option value="support">Get product support</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Message</label>
        <textarea
          name="message"
          rows={4}
          placeholder="Any additional details"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
        />
      </div>

      <RecaptchaCheck ref={recaptchaRef} />

      {status === 'error' && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {errorMsg}
        </div>
      )}
      {status === 'success' && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Thank you! We will be in touch soon.
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex items-center gap-2 rounded-lg bg-[#065f46] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#064e3b] disabled:opacity-60"
        >
          <span>{status === 'submitting' ? 'Sending...' : 'Submit'}</span>
          <span aria-hidden>↗</span>
        </button>
      </div>
    </form>
  );
}
