'use client';

import type { RegisterFormData } from '@schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, Envelope } from '@phosphor-icons/react';
import { RegisterValidation } from '@schemas/auth';
import { useRegister } from '@services/auth';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/components/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/components/form';
import { Input } from '@/components/ui/components/input';
import { PasswordInput } from '@/components/ui/components/password-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/components/select';

const baseLabelClasses = '!text-lg font-semibold text-foreground';
const inputClasses = 'h-12 !text-lg';
const selectTriggerClasses = 'h-12 !text-lg';
const selectItemClasses = '!text-lg py-3';

export const RegisterForm = () => {
  const t = useTranslations('RegisterForm');
  const registerMutation = useRegister();
  const [isRegistered, setIsRegistered] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterValidation),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullname: '',
      locale: 'en-US',
      user_address: '',
    },
  });

  const handleRegister = form.handleSubmit(async (data) => {
    // Transform data to match API requirements
    const registerData = {
      email: data.email,
      password: data.password,
      fullname: data.fullname,
      locale: data.locale || 'en-US',
      user_address: data.user_address || '',
    };

    registerMutation.mutate(registerData, {
      onSuccess: () => {
        setIsRegistered(true);
        setUserEmail(data.email);
      },
    });
  });

  // Show success message if registration is successful
  if (isRegistered) {
    return (
      <div className="mx-auto w-full max-w-xl text-lg">
        <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 p-12 text-center shadow-lg">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-500 shadow-lg">
            <CheckCircle size={48} className="text-white" />
          </div>

          <h1 className="mb-6 text-3xl font-bold text-gray-900">
            {t('success_title')}
          </h1>

          <p className="mb-8 text-xl text-gray-700">
            {t('success_message')}
          </p>

          <div className="mb-10 rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-center gap-3">
              <Envelope size={24} className="text-green-600" />
              <span className="text-xl font-semibold text-gray-900">{userEmail}</span>
            </div>
          </div>

          <p className="mb-8 text-lg text-gray-600">
            {t('check_email_message')}
          </p>

          <div className="space-y-5">
            <Button
              asChild
              className="w-full bg-green-600 py-6 text-lg hover:bg-green-700"
            >
              <Link href="/auth/login">
                {t('go_to_login')}
              </Link>
            </Button>

            <p className="text-base text-gray-500">
              {t('no_email_message')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl text-lg">
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-3xl font-bold text-foreground">
          {t('title')}
        </h1>
        <p className="text-lg text-muted-foreground">
          {t('subtitle')}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={handleRegister} className="space-y-6">
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={baseLabelClasses}>{t('fullname_label')}</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={t('fullname_placeholder')}
                    hasError={!!form.formState.errors.fullname}
                    className={inputClasses}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Locale */}
          <FormField
            control={form.control}
            name="locale"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={baseLabelClasses}>Locale</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className={selectTriggerClasses}>
                      <SelectValue placeholder="Select locale" className="text-lg" />
                    </SelectTrigger>
                    <SelectContent className="text-lg">
                      <SelectItem value="en-US" className={selectItemClasses}>English (United States)</SelectItem>
                      <SelectItem value="vi-VN" className={selectItemClasses}>Tiếng Việt (Việt Nam)</SelectItem>
                      <SelectItem value="fr-FR" className={selectItemClasses}>Français (France)</SelectItem>
                      <SelectItem value="de-DE" className={selectItemClasses}>Deutsch (Deutschland)</SelectItem>
                      <SelectItem value="ja-JP" className={selectItemClasses}>日本語 (日本)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Address */}
          <FormField
            control={form.control}
            name="user_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={baseLabelClasses}>Address</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your address"
                    hasError={!!form.formState.errors.user_address}
                    className={inputClasses}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={baseLabelClasses}>{t('email_label')}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t('email_placeholder')}
                    hasError={!!form.formState.errors.email}
                    className={inputClasses}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={baseLabelClasses}>{t('password_label')}</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder={t('password_placeholder')}
                    hasError={!!form.formState.errors.password}
                    className={inputClasses}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={baseLabelClasses}>{t('confirm_password_label')}</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder={t('confirm_password_placeholder')}
                    hasError={!!form.formState.errors.confirmPassword}
                    className={inputClasses}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {registerMutation.error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-4 text-base text-red-600">
              {registerMutation.error.message || t('error_generic')}
            </div>
          )}

          <Button
            type="submit"
            className="w-full py-6 text-lg"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? t('registering_button') : t('register_button')}
          </Button>
        </form>
      </Form>

      <div className="mt-10 text-center">
        <p className="text-lg text-muted-foreground">
          {t('have_account')}
          {' '}
          <Link
            href="/auth/login"
            className="font-semibold text-primary transition-colors hover:text-primary/80"
          >
            {t('sign_in_link')}
          </Link>
        </p>
      </div>
    </div>
  );
};
