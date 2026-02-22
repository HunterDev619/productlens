'use client';

import type { Resolver, SubmitHandler } from 'react-hook-form';
import type { AdminUserUpdateFormValues } from '@/schemas/admin/user-update';
import type { User } from '@/services/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, ShieldCheck, ShieldWarning, User as UserIcon } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Form, FormControl, FormField, FormItem, FormMessage, Input } from '@/components/ui';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/components/dialog';
import { toast } from '@/hooks/use-toast';
import { AdminUserUpdateSchema } from '@/schemas/admin/user-update';
import { useDeleteUser } from '@/services/admin/users/delete';
import { useDemoteUserFromAdmin } from '@/services/admin/users/demote-from-admin';
import { usePromoteUserToAdmin } from '@/services/admin/users/promote-to-admin';
import { useAdminUpdateUser } from '@/services/admin/users/update';
import { useUploadImage } from '@/services/images/upload';

const SUPABASE_STORAGE_URL = 'https://ecupkgoliskuhacfxrzx.supabase.co/storage/v1/object/public/';

type UserDetailModalProps = {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onUserDeleted?: () => void;
};

export function UserDetailModal({ user, isOpen, onClose, onUserDeleted }: UserDetailModalProps) {
  const { deleteUser, isPending } = useDeleteUser();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { promoteUserToAdmin, isPending: isPromoting } = usePromoteUserToAdmin();
  const { demoteUserFromAdmin, isPending: isDemoting } = useDemoteUserFromAdmin();
  const { mutateAsync: updateUser, isPending: isUpdating } = useAdminUpdateUser();
  const { uploadImage, isPending: isUploading } = useUploadImage();
  const [isEditing, setIsEditing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<AdminUserUpdateFormValues>({
    resolver: zodResolver(AdminUserUpdateSchema) as Resolver<AdminUserUpdateFormValues>,
    defaultValues: {
      fullname: '',
      locale: '',
      phone: undefined,
      userAddress: undefined,
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    if (!user || !isOpen) {
      return;
    }
    form.reset({
      fullname: user.fullname || '',
      locale: user.locale || '',
      phone: user.phone || undefined,
      userAddress: user.userAddress || undefined,
    });
    setPreviewUrl(null);
    setIsEditing(false);
  }, [user, isOpen, form]);

  if (!user) {
    return null;
  }

  const emailVerified = Boolean(user.identities?.[0]?.identity_data?.email_verified);
  const phoneVerified = Boolean(user.identities?.[0]?.identity_data?.phone_verified);
  const formatDate = (iso?: string) => {
    if (!iso) {
      return '-';
    }
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser(user.id);
      onUserDeleted?.();
      onClose();
    } catch {
      // Error is handled by the useDeleteUser hook
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handlePromote = async () => {
    if (!user) {
      return;
    }
    try {
      await promoteUserToAdmin(user.id);
    } catch {
      // handled in hook
    }
  };

  const handleDemote = async () => {
    if (!user) {
      return;
    }
    try {
      await demoteUserFromAdmin(user.id);
    } catch {
      // handled in hook
    }
  };

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (user) {
      form.reset({
        fullname: user.fullname || '',
        locale: user.locale || '',
        phone: user.phone || undefined,
        userAddress: user.userAddress || undefined,
      });
    }
    setPreviewUrl(null);
    setIsEditing(false);
  };

  const onSubmit: SubmitHandler<AdminUserUpdateFormValues> = async (values) => {
    if (!user) {
      return;
    }
    try {
      await updateUser({
        userId: user.id,
        payload: {
          fullname: values.fullname,
          locale: values.locale,
          phone: values.phone,
          userAddress: values.userAddress,
        },
      });
      setIsEditing(false);
      setPreviewUrl(null);
    } catch {
      // handled in hook
    }
  };

  const handleChangePicture = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Error',
        description: 'Please select a valid image file',
        variant: 'error',
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const response = await uploadImage(file);

      if (response.error === '00' && response.data?.r2_key) {
        const avatarUrl = `${SUPABASE_STORAGE_URL}${response.data.r2_key}`;

        await updateUser({
          userId: user.id,
          payload: { picture: avatarUrl },
        });

        toast({
          title: 'Success',
          description: 'Avatar updated successfully',
        });
        setPreviewUrl(null);
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to upload image',
          variant: 'error',
        });
        setPreviewUrl(null);
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.message || 'Failed to upload avatar',
        variant: 'error',
      });
      setPreviewUrl(null);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const avatarUrl = previewUrl || user.picture;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto bg-white">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>User Details</DialogTitle>
                <DialogDescription>
                  Detailed information about the selected user
                </DialogDescription>
              </div>
              {!isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleStartEdit}
                  className="h-8 px-3 text-xs"
                >
                  Edit User
                </Button>
              )}
              {isEditing && (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCancelEdit}
                    disabled={isUpdating || isUploading}
                    className="h-8 px-3 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    form="user-update-form"
                    disabled={isUpdating || isUploading}
                    className="h-8 px-3 text-xs"
                  >
                    {isUpdating ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              )}
            </div>
          </DialogHeader>

          <Form {...form}>
            <form id="user-update-form" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-6">
                {/* Header - styled like profile header */}
                <div className="">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      {isUploading && (
                        <div className="h-20 w-20 animate-pulse rounded-full bg-gray-200" />
                      )}
                      {!isUploading && avatarUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={avatarUrl}
                          alt={user.fullname || user.email}
                          className="h-20 w-20 rounded-full object-cover"
                        />
                      )}
                      {!isUploading && !avatarUrl && (
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                          <UserIcon size={28} className="text-gray-500" />
                        </div>
                      )}
                      <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {!isEditing
                          ? (
                              <h3 className="text-xl font-bold text-gray-900">{user.fullname || user.email || 'User'}</h3>
                            )
                          : (
                              <div className="w-full max-w-xs">
                                <FormField
                                  control={form.control}
                                  name="fullname"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input
                                          placeholder="Full name"
                                          className="h-9"
                                          hasError={!!form.formState.errors.fullname}
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
                              </div>
                            )}
                        <span className="rounded-full bg-gray-900 px-2 py-0.5 text-xs font-semibold text-white">{user.role}</span>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${emailVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {emailVerified ? <CheckCircle size={14} /> : <ShieldWarning size={14} />}
                          {emailVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        Member since
                        {' '}
                        {formatDate(user.createdAt)}
                      </div>
                      {isEditing && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleChangePicture}
                          disabled={isUploading || isUpdating}
                          className="mt-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-md hover:bg-gray-50 disabled:opacity-50"
                        >
                          {isUploading ? 'Uploading...' : 'Change Picture'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                {/* Basic Information */}
                <div>
                  <h3 className="mb-3 text-lg font-medium text-gray-900">Basic Information</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <div className="text-sm font-medium text-gray-500">User ID</div>
                      <p className="mt-1 font-mono text-sm break-all text-gray-900">{user.id}</p>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Email</div>
                      <p className="mt-1 text-sm text-gray-900">{user.email || '-'}</p>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Phone</div>
                      {!isEditing
                        ? (
                            <>
                              <p className="mt-1 text-sm text-gray-900">{user.phone || '-'}</p>
                              <div className={`mt-1 inline-flex items-center gap-1 text-xs ${phoneVerified ? 'text-green-700' : 'text-yellow-700'}`}>
                                {phoneVerified ? <ShieldCheck size={14} /> : <ShieldWarning size={14} />}
                                {phoneVerified ? 'Verified' : 'Unverified'}
                              </div>
                            </>
                          )
                        : (
                            <div className="mt-1">
                              <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        placeholder="Phone number"
                                        className="h-9"
                                        hasError={!!form.formState.errors.phone}
                                        value={field.value || ''}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        name={field.name}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Provider</div>
                      <p className="mt-1 text-sm text-gray-900">{user.provider}</p>
                    </div>
                  </div>
                </div>

                {/* Status & Security */}
                <div>
                  <h3 className="mb-3 text-lg font-medium text-gray-900">Status & Security</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <div className="text-sm font-medium text-gray-500">Status</div>
                      <div className="mt-1">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          user.status === 1
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                        >
                          {user.status === 1 ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">2FA Enabled</div>
                      <div className="mt-1">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          user.twoFactorEnabled
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                        >
                          {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Language</div>
                      {!isEditing
                        ? (
                            <p className="mt-1 text-sm text-gray-900">{user.locale}</p>
                          )
                        : (
                            <div className="mt-1">
                              <FormField
                                control={form.control}
                                name="locale"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        placeholder="Language code (e.g. en-US)"
                                        className="h-9"
                                        hasError={!!form.formState.errors.locale}
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
                            </div>
                          )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Address</div>
                      {!isEditing
                        ? (
                            <p className="mt-1 text-sm text-gray-900">{user.userAddress || '-'}</p>
                          )
                        : (
                            <div className="mt-1">
                              <FormField
                                control={form.control}
                                name="userAddress"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        placeholder="Address"
                                        className="h-9"
                                        hasError={!!form.formState.errors.userAddress}
                                        value={field.value || ''}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        name={field.name}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          )}
                    </div>
                  </div>
                </div>

                {/* Timestamps */}
                <div>
                  <h3 className="mb-3 text-lg font-medium text-gray-900">Timestamps</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <div className="text-sm font-medium text-gray-500">Created At</div>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(user.createdAt).toLocaleString('en-US')}
                      </p>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Updated At</div>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(user.updatedAt).toLocaleString('en-US')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Profile Picture (omit, already shown in header) */}
              </div>
            </form>
          </Form>

          <DialogFooter>
            <div className="flex w-full justify-between">
              <div className="flex items-center gap-2">
                {!isEditing && (
                  <>
                    {user.role !== 'ADMIN' && (
                      <Button
                        type="button"
                        onClick={handlePromote}
                        disabled={isPromoting || isPending}
                        className="rounded-md bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
                      >
                        {isPromoting ? 'Promoting...' : 'Promote to Admin'}
                      </Button>
                    )}
                    {user.role === 'ADMIN' && (
                      <Button
                        type="button"
                        onClick={handleDemote}
                        disabled={isDemoting || isPending}
                        className="rounded-md bg-yellow-500 px-4 py-2 text-white transition-colors hover:bg-yellow-600 disabled:opacity-50"
                      >
                        {isDemoting ? 'Demoting...' : 'Demote from Admin'}
                      </Button>
                    )}
                    <Button
                      type="button"
                      onClick={handleDeleteClick}
                      disabled={isPending}
                      className="rounded-md bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                    >
                      {isPending ? 'Deleting...' : 'Delete User'}
                    </Button>
                  </>
                )}
              </div>
              <Button
                type="button"
                onClick={onClose}
                className="rounded-md bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200"
              >
                Close
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
              <br />
              <br />
              <strong>
                User:
                {user.email || user.fullname || user.id}
              </strong>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                onClick={handleCancelDelete}
                disabled={isPending}
                className="rounded-md bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleDeleteUser}
                disabled={isPending}
                className="rounded-md bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {isPending ? 'Deleting...' : 'Delete User'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
