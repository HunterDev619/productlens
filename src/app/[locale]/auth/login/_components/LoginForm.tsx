'use client';

import type { LoginFormData } from '@schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginValidation } from '@schemas/auth';
import { useLogin } from '@services/auth';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { Button } from '@/components/ui/components/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/components/form';
import { Input } from '@/components/ui/components/input';
import { PasswordInput } from '@/components/ui/components/password-input';

export const LoginForm = () => {
  const t = useTranslations('LoginForm');
  const searchParams = useSearchParams();
  const [sessionMessage, setSessionMessage] = useState<string | null>(null);
  const [logoSrc, setLogoSrc] = useState('/logo/main.png');
  const loginMutation = useLogin();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginValidation),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    // Check for session expired or other error messages in URL
    const error = searchParams.get('error');
    if (error !== 'session_expired') {
      return undefined;
    }
    
    setSessionMessage('Your session has expired. Please log in again.');
    // Clear the error from URL after showing it
    const timer = setTimeout(() => {
      setSessionMessage(null);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [searchParams]);

  const handleLogin = form.handleSubmit(async (data) => {
    try {
      await loginMutation.mutateAsync(data);
    } catch {
      // Error is already handled by the mutation's error state
      // No need to do anything here, error will be displayed in the UI
    }
  });

  return (
    <div className="mx-auto w-full max-w-2xl text-lg">
      <div className="mb-10 text-center">
        <Link href="/" className="inline-block">
          <Image
            src={logoSrc}
            alt="ProductLens Logo"
            width={80}
            height={80}
            className="mx-auto h-16 w-16 object-contain"
            priority
            onError={() => setLogoSrc((prev) => (prev.endsWith('.png') ? '/logo/main.jpg' : prev))}
          />
        </Link>
        <h1 className="mb-3 text-4xl font-bold text-foreground">
          {t('title')}
        </h1>
        <p className="text-xl text-muted-foreground">
          {t('subtitle')}
        </p>
      </div>

      {sessionMessage && (
        <div className="mb-6 rounded-lg border-2 border-yellow-200 bg-yellow-50 p-4 text-base font-semibold text-yellow-800">
          {sessionMessage}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={handleLogin} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold">{t('email_label')}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t('email_placeholder')}
                    hasError={!!form.formState.errors.email}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    className="h-14 rounded-lg border-2 px-5 py-3 !text-lg placeholder:text-base"
                  />
                </FormControl>
                <FormMessage className="text-base" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold">{t('password_label')}</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder={t('password_placeholder')}
                    hasError={!!form.formState.errors.password}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    className="h-14 rounded-lg border-2 px-5 py-3 text-lg placeholder:text-base"
                  />
                </FormControl>
                <FormMessage className="text-base" />
              </FormItem>
            )}
          />

          {loginMutation.error && (
            <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4 text-base font-semibold text-red-700">
              {loginMutation.error.message || t('error_generic')}
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            className="h-14 w-full rounded-lg text-lg font-semibold"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? t('signing_in_button') : t('sign_in_button')}
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center">
        <Link
          href="/auth/forgot-password"
          className="text-lg font-medium text-primary transition-colors hover:text-primary/80"
        >
          {t('forgot_password')}
        </Link>
      </div>

      <div className="mt-8 text-center">
        <p className="text-lg text-muted-foreground">
          {t('no_account')}
          {' '}
          <Link
            href="/auth/register"
            className="font-semibold text-primary transition-colors hover:text-primary/80"
          >
            {t('sign_up_link')}
          </Link>
        </p>
      </div>
    </div>
  );
};
