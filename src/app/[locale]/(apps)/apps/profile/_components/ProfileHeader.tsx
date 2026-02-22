'use client';

import type { UseFormReturn } from 'react-hook-form';
import type { ProfileFormValues } from '@/schemas/profile';
import { CalendarBlank, CheckCircle, IdentificationCard, ShieldWarning, UserCircle, User as UserIcon } from '@phosphor-icons/react';
import React from 'react';
import { Button, FormControl, FormField, FormItem, FormMessage, Input, Label } from '@/components/ui';

type Props = {
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  isSaving: boolean;
  isUploading: boolean;
  onTriggerUpload: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInput: React.RefObject<HTMLInputElement | null>;
  avatarUrl: string | null;
  emailVerified: boolean;
  createdAt: string;
  role: string;
  displayName: string;
  form: UseFormReturn<ProfileFormValues>;
};

export default function ProfileHeader({
  isEditing,
  onStartEdit,
  onCancelEdit,
  isSaving,
  isUploading,
  onTriggerUpload,
  onFileChange,
  fileInput,
  avatarUrl,
  emailVerified,
  createdAt,
  role,
  displayName,
  form,
}: Props) {
  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          <UserCircle size={20} className="text-gray-700" />
          Profile Information
        </h2>
        {!isEditing && (
          <Button type="button" variant="outline" onClick={onStartEdit} className="h-8 px-3 text-xs">
            Edit Profile
          </Button>
        )}
        {isEditing && (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancelEdit}
              disabled={isSaving}
              className="h-8 px-3 text-xs"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving} className="h-8 px-3 text-xs">
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <input ref={fileInput} type="file" accept="image/*" onChange={onFileChange} className="hidden" />
          {isUploading && <div className="h-20 w-20 animate-pulse rounded-full bg-gray-200" />}
          {!isUploading && avatarUrl && (
            <img src={avatarUrl} alt={displayName} className="h-20 w-20 rounded-full object-cover" />
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
            {!isEditing && <h3 className="text-xl font-bold text-gray-900">{displayName}</h3>}
            {isEditing && (
              <div className="w-full max-w-xs">
                <Label className="text-xs text-gray-500">Full name</Label>
                <div className="mt-1">
                  <FormField
                    control={form.control}
                    name="fullname"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Your full name"
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
              </div>
            )}
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-900 px-2 py-0.5 text-xs font-semibold text-white">
              <IdentificationCard size={12} />
              {role}
            </span>
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${emailVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {emailVerified ? <CheckCircle size={14} /> : <ShieldWarning size={14} />}
              {emailVerified ? 'Verified' : 'Unverified'}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
            <CalendarBlank size={14} />
            <span>Member since</span>
            {createdAt}
          </div>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={onTriggerUpload}
        className="mt-4 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-md hover:bg-gray-50 disabled:opacity-50"
      >
        Change Picture
      </Button>
    </div>
  );
}
