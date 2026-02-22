'use client';

import type { ResetPasswordBody } from '@/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeSlash } from '@phosphor-icons/react';
import React from 'react';
import { useForm } from 'react-hook-form';
// (removed duplicate React import)
import { z } from 'zod';
import { Button, Input, Label } from '@/components/ui/components';
import { useAuthenticatedResetPassword } from '@/services/auth';

export default function ResetPasswordPageContent() {
  const { mutateAsync: resetPassword, isPending } = useAuthenticatedResetPassword();

  const [showOld, setShowOld] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  // Build form schema separately (avoid extending refined schema)
  const ResetPasswordFormValidation = z.object({
    old_password: z
      .string()
      .min(1, 'Old password is required'),
    new_password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters long')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    confirm_password: z
      .string()
      .min(1, 'Please confirm your new password'),
  }).refine(data => data.new_password === data.confirm_password, {
    message: 'Passwords don\'t match',
    path: ['confirm_password'],
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordBody & { confirm_password: string }>({
    resolver: zodResolver(ResetPasswordFormValidation),
    defaultValues: {
      old_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  const onSubmit = async (data: ResetPasswordBody & { confirm_password: string }) => {
    await resetPassword({ old_password: data.old_password, new_password: data.new_password });
    reset();
  };

  return (
    <div className="relative -mx-2 flex h-screen items-center justify-center rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 px-2 py-8 lg:px-4">
      {/* Decorative blob */}
      <div className="pointer-events-none absolute top-6 right-6 hidden h-40 w-40 rounded-full bg-gradient-to-br from-sky-200 to-indigo-200 opacity-40 blur-3xl lg:block" />

      <div className="mx-auto w-full max-w-2xl px-2 lg:px-0">
        <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm ring-1 ring-slate-100/60 backdrop-blur-md lg:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Reset your password</h1>
            <p className="mt-1 text-sm text-slate-600">For security, choose a strong, unique password you don’t use elsewhere.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="old_password" className="text-xs font-medium text-slate-700">Old password</Label>
              <div className="relative">
                <Input
                  id="old_password"
                  type={showOld ? 'text' : 'password'}
                  placeholder="Enter your current password"
                  className="mt-1 h-11 rounded-lg border-slate-300 bg-white pr-10 text-slate-900 shadow-inner ring-1 ring-slate-200 transition ring-inset focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40 focus:outline-none"
                  {...register('old_password')}
                />
                <button
                  type="button"
                  aria-label={showOld ? 'Hide password' : 'Show password'}
                  onClick={() => setShowOld(v => !v)}
                  className="absolute inset-y-0 right-2 mt-1 flex items-center rounded-md p-2 text-slate-500 hover:text-slate-700"
                >
                  {showOld ? <EyeSlash size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="mt-1.5 text-xs text-slate-500">Use the password you are currently signed in with.</p>
              {errors.old_password && (
                <p className="mt-1 text-xs font-medium text-red-600">{String(errors.old_password.message)}</p>
              )}
            </div>

            <div>
              <Label htmlFor="new_password" className="text-xs font-medium text-slate-700">New password</Label>
              <div className="relative">
                <Input
                  id="new_password"
                  type={showNew ? 'text' : 'password'}
                  placeholder="Enter a new password"
                  className="mt-1 h-11 rounded-lg border-slate-300 bg-white pr-10 text-slate-900 shadow-inner ring-1 ring-slate-200 transition ring-inset focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40 focus:outline-none"
                  {...register('new_password')}
                />
                <button
                  type="button"
                  aria-label={showNew ? 'Hide password' : 'Show password'}
                  onClick={() => setShowNew(v => !v)}
                  className="absolute inset-y-0 right-2 mt-1 flex items-center rounded-md p-2 text-slate-500 hover:text-slate-700"
                >
                  {showNew ? <EyeSlash size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="mt-1.5 text-xs text-slate-500">Minimum 8 characters with upper, lower, number, and symbol.</p>
              {errors.new_password && (
                <p className="mt-1 text-xs font-medium text-red-600">{String(errors.new_password.message)}</p>
              )}
            </div>

            <div>
              <Label htmlFor="confirm_password" className="text-xs font-medium text-slate-700">Confirm new password</Label>
              <div className="relative">
                <Input
                  id="confirm_password"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Re-enter new password"
                  className="mt-1 h-11 rounded-lg border-slate-300 bg-white pr-10 text-slate-900 shadow-inner ring-1 ring-slate-200 transition ring-inset focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40 focus:outline-none"
                  {...register('confirm_password')}
                />
                <button
                  type="button"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  onClick={() => setShowConfirm(v => !v)}
                  className="absolute inset-y-0 right-2 mt-1 flex items-center rounded-md p-2 text-slate-500 hover:text-slate-700"
                >
                  {showConfirm ? <EyeSlash size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="mt-1 text-xs font-medium text-red-600">{String(errors.confirm_password.message)}</p>
              )}
            </div>

            <div className="pt-1">
              <Button
                type="submit"
                disabled={isPending}
                className="h-11 w-full rounded-lg bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-sm transition hover:from-sky-500 hover:to-indigo-600 hover:shadow focus-visible:ring-2 focus-visible:ring-sky-500/50 focus-visible:outline-none disabled:opacity-60"
              >
                {isPending ? 'Updating…' : 'Update password'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
