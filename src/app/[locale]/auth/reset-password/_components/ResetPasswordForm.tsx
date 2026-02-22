'use client';

import type { ResetPasswordFormData } from '@schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, Eye, EyeSlash, Lock, XCircle } from '@phosphor-icons/react';
import { ResetPasswordValidation } from '@schemas/auth';
import { useResetPassword } from '@services/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/components/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/components/form';
import { Input } from '@/components/ui/components/input';
import { toast } from '@/hooks/use-toast';

const baseLabelClasses = '!text-lg font-semibold text-foreground';
const inputClasses = 'h-12 !text-lg';

type ResetPasswordState = 'checking' | 'ready' | 'invalid' | 'success' | 'error';

export const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetPasswordMutation = useResetPassword();
  const [state, setState] = useState<ResetPasswordState>('checking');
  const [token, setToken] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordValidation),
    defaultValues: {
      password: '',
      confirmPassword: '',
      token: '',
    },
  });

  // Extract token from URL hash (Supabase sends params in hash, not query string)
  useEffect(() => {
    // Get hash from URL (everything after #)
    const hash = window.location.hash.substring(1);
    const hashParams = new URLSearchParams(hash);
    
    // Check for error in hash params
    const error = hashParams.get('error');
    const errorCode = hashParams.get('error_code');
    const errorDescription = hashParams.get('error_description');
    
    if (error) {
      setState('invalid');
      let errorMessage = 'The reset link is invalid or has expired.';
      
      if (errorCode === 'otp_expired') {
        errorMessage = 'Reset link has expired. Please request a new one.';
      } else if (errorDescription) {
        errorMessage = decodeURIComponent(errorDescription);
      }
      
      toast({
        title: 'Invalid Link',
        description: errorMessage,
        variant: 'error',
      });
      return;
    }
    
    // Extract access_token from hash
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');
    
    // Verify it's a recovery type
    if (type !== 'recovery') {
      // Try getting token from query params as fallback
      const tokenParam = searchParams.get('token');
      if (tokenParam) {
        setToken(tokenParam);
        form.setValue('token', tokenParam);
        setState('ready');
        return;
      }
      
      setState('invalid');
      toast({
        title: 'Invalid Link',
        description: 'This is not a valid password reset link. Please check your email for the correct link.',
        variant: 'error',
      });
      return;
    }
    
    if (!accessToken) {
      setState('invalid');
      toast({
        title: 'Invalid Link',
        description: 'Reset token is missing. Please check your email for the correct link.',
        variant: 'error',
      });
      return;
    }
    
    // Set the access token as the token
    setToken(accessToken);
    form.setValue('token', accessToken);
    setState('ready');
  }, [searchParams, form]);

  const handleResetPassword = form.handleSubmit(async (data) => {
    try {
      setState('checking');
      const response = await resetPasswordMutation.mutateAsync({
        token_hash: data.token,
        new_password: data.password,
      });

      if (response.error === '0' || response.error === '00') {
        setState('success');
        toast({
          title: 'Success',
          description: response.message || 'Password reset successfully. You can now login with your new password.',
        });
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        setState('error');
        toast({
          title: 'Error',
          description: response.message || 'Failed to reset password. The token may have expired.',
          variant: 'error',
        });
      }
    } catch (error: any) {
      setState('error');
      toast({
        title: 'Error',
        description: error?.response?.data?.message || error?.message || 'Failed to reset password',
        variant: 'error',
      });
    }
  });

  // Loading state - checking/verifying reset link
  if (state === 'checking') {
    return (
      <div className="mx-auto w-full max-w-xl text-lg">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
          </div>
          <h1 className="mb-4 text-3xl font-bold text-foreground">
            Reset Your Password
          </h1>
          <p className="text-lg text-muted-foreground">
            {resetPasswordMutation.isPending ? 'Updating password...' : 'Verifying reset link...'}
          </p>
        </div>
      </div>
    );
  }

  // Invalid link state
  if (state === 'invalid') {
    return (
      <div className="mx-auto w-full max-w-xl text-lg">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-12 text-center shadow-lg">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-red-500 shadow-lg">
            <XCircle size={48} className="text-white" weight="fill" />
          </div>
          <h1 className="mb-6 text-3xl font-bold text-gray-900">
            Invalid Reset Link
          </h1>
          <p className="mb-8 text-lg text-gray-700">
            The reset link is invalid or has expired. Please request a new password reset.
          </p>
          <div className="space-y-4">
            <Button
              onClick={() => router.push('/auth/forgot-password')}
              className="w-full bg-blue-600 py-6 text-lg text-white hover:bg-blue-700"
            >
              Request New Reset Link
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/auth/login')}
              className="w-full py-6 text-lg"
            >
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (state === 'success') {
    return (
      <div className="mx-auto w-full max-w-xl text-lg">
        <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 p-12 text-center shadow-lg">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-500 shadow-lg">
            <CheckCircle size={48} className="text-white" weight="fill" />
          </div>
          <h1 className="mb-6 text-3xl font-bold text-gray-900">
            Password Updated Successfully
          </h1>
          <p className="mb-8 text-lg text-gray-700">
            Your password has been updated. You can now login with your new password.
          </p>
          <p className="mb-8 text-base text-gray-600">
            Redirecting to login page...
          </p>
          <Button
            onClick={() => router.push('/auth/login')}
            className="w-full bg-green-600 py-6 text-lg text-white hover:bg-green-700"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  // Ready state - show password form
  return (
    <div className="mx-auto w-full max-w-xl text-lg">
      <div className="mb-10 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
          <Lock size={40} className="text-blue-600" weight="fill" />
        </div>
        <h1 className="mb-4 text-3xl font-bold text-foreground">
          Reset Your Password
        </h1>
        <p className="text-lg text-muted-foreground">
          Enter your new password below
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={handleResetPassword} className="space-y-8">
          {/* Hidden token field */}
          <input type="hidden" {...form.register('token')} />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={baseLabelClasses}>New Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      className={inputClasses}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 transition-colors hover:text-gray-700"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeSlash size={24} /> : <Eye size={24} />}
                    </button>
                  </div>
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
                <FormLabel className={baseLabelClasses}>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      className={inputClasses}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 transition-colors hover:text-gray-700"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeSlash size={24} /> : <Eye size={24} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full py-6 text-lg"
            disabled={resetPasswordMutation.isPending || !token}
          >
            {resetPasswordMutation.isPending ? 'Updating Password...' : 'Update Password'}
          </Button>
        </form>
      </Form>

      <div className="mt-10 text-center">
        <button
          type="button"
          onClick={() => router.push('/auth/login')}
          className="text-lg text-muted-foreground hover:text-foreground"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};
