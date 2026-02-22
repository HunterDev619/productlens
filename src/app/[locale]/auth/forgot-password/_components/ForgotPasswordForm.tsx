'use client';

import type { ForgotPasswordFormData } from '@schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, CheckCircle, Envelope } from '@phosphor-icons/react';
import { ForgotPasswordValidation } from '@schemas/auth';
import { useForgotPassword } from '@services/auth';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/components/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/components/form';
import { Input } from '@/components/ui/components/input';
import { toast } from '@/hooks/use-toast';

const baseLabelClasses = '!text-lg font-semibold text-foreground';
const inputClasses = 'h-12 !text-lg';

export const ForgotPasswordForm = () => {
  const forgotPasswordMutation = useForgotPassword();
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordValidation),
    defaultValues: {
      email: '',
    },
  });

  const handleForgotPassword = form.handleSubmit(async (data) => {
    try {
      const response = await forgotPasswordMutation.mutateAsync(data);
      if (response.error === '00') {
        setIsEmailSent(true);
        setUserEmail(data.email);
        toast({
          title: 'Success',
          description: response.message || 'Password reset email sent. Please check your email.',
        });
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to send password reset email',
          variant: 'error',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || error?.message || 'Failed to send password reset email',
        variant: 'error',
      });
    }
  });

  // Show success message if email is sent
  if (isEmailSent) {
    return (
      <div className="mx-auto w-full max-w-xl text-lg">
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 p-12 text-center shadow-lg">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-blue-500 shadow-lg">
            <CheckCircle size={48} className="text-white" />
          </div>

          <h1 className="mb-6 text-3xl font-bold text-gray-900">
            Check Your Email
          </h1>

          <p className="mb-8 text-xl text-gray-700">
            Password reset email sent. Please check your email.
          </p>

          <div className="mb-10 rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-center gap-3">
              <Envelope size={24} className="text-blue-600" />
              <span className="text-xl font-semibold text-gray-900">{userEmail}</span>
            </div>
          </div>

          <p className="mb-8 text-lg text-gray-600">
            We've sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.
          </p>

          <div className="space-y-5">
            <Button
              asChild
              className="w-full bg-blue-600 py-6 text-lg text-white hover:bg-blue-700"
            >
              <Link href="/auth/login">
                <ArrowLeft size={24} className="mr-3" />
                Back to Login
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl text-lg">
      <div className="mb-10 text-center">
        <h1 className="mb-4 text-3xl font-bold text-foreground">
          Forgot Password?
        </h1>
        <p className="text-lg text-muted-foreground">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={handleForgotPassword} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={baseLabelClasses}>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className={inputClasses}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full py-6 text-lg"
            disabled={forgotPasswordMutation.isPending}
          >
            {forgotPasswordMutation.isPending ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
      </Form>

      <div className="mt-10 text-center">
        <Link
          href="/auth/login"
          className="flex items-center justify-center gap-3 text-lg text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={20} />
          Back to Login
        </Link>
      </div>
    </div>
  );
};
