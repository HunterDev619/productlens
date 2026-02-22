'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeSlash } from '@phosphor-icons/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/components/dialog';
import { Input } from '@/components/ui/components/input';
import { Label } from '@/components/ui/components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/components/select';
import { useAdminCreateUser } from '@/services/admin/users/create';

const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullname: z.string().min(1, 'Full name is required'),
  picture: z.string().url('Invalid URL').optional().or(z.literal('')),
  userAddress: z.string().optional(),
  locale: z.string().optional(),
  provider: z.string().optional(),
  status: z.boolean().optional(),
  twoFactorEnabled: z.boolean().optional(),
  email_confirm: z.boolean().optional(),
  role: z.string().optional(),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

type CreateUserModalProps = {
  isOpen: boolean;
  onCloseAction: () => void;
};

export function CreateUserModal({ isOpen, onCloseAction }: CreateUserModalProps) {
  const { createUser, isPending } = useAdminCreateUser();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: '',
      password: '',
      fullname: '',
      picture: '',
      userAddress: '',
      locale: 'en-US',
      provider: 'email',
      status: true,
      twoFactorEnabled: false,
      email_confirm: false,
      role: 'USER',
    },
  });

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      await createUser({
        email: data.email,
        password: data.password,
        fullname: data.fullname,
        picture: data.picture || undefined,
        userAddress: data.userAddress || undefined,
        locale: data.locale || 'en-US',
        provider: data.provider || 'email',
        status: data.status ? 1 : 0,
        twoFactorEnabled: data.twoFactorEnabled || false,
        email_confirm: data.email_confirm || false,
        role: data.role || 'USER',
      });
      reset();
      onCloseAction();
    } catch {
      // Error is handled by the useAdminCreateUser hook
    }
  };

  const handleClose = () => {
    reset();
    onCloseAction();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new user account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="user@example.com"
              />
              {errors.email && (
                <p className="text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <Eye size={16} /> : <EyeSlash size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullname">Full Name *</Label>
            <Input
              id="fullname"
              {...register('fullname')}
              placeholder="John Doe"
            />
            {errors.fullname && (
              <p className="text-xs text-red-600">{errors.fullname.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="picture">Picture URL</Label>
            <Input
              id="picture"
              type="url"
              {...register('picture')}
              placeholder="https://example.com/avatar.jpg"
            />
            {errors.picture && (
              <p className="text-xs text-red-600">{errors.picture.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="userAddress">Address</Label>
            <Input
              id="userAddress"
              {...register('userAddress')}
              placeholder="123 Main St, City, Country"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="locale">Locale</Label>
              <Input
                id="locale"
                {...register('locale')}
                placeholder="en-US"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={watch('role') || 'USER'} onValueChange={val => setValue('role', val)}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">USER</SelectItem>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="status"
                {...register('status')}
                defaultChecked
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="status" className="cursor-pointer">
                Active
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="twoFactorEnabled"
                {...register('twoFactorEnabled')}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="twoFactorEnabled" className="cursor-pointer">
                Two-Factor Authentication
              </Label>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="email_confirm"
              {...register('email_confirm')}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="email_confirm" className="cursor-pointer">
              Email Confirmed
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
