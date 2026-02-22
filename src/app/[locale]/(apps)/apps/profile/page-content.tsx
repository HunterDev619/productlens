'use client';

import type { Resolver, SubmitHandler } from 'react-hook-form';
import type { ProfileFormValues } from '@/schemas/profile';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui';
import { toast } from '@/hooks/use-toast';
import { ProfileSchema } from '@/schemas/profile';
import { useUpdateProfile, useUserProfile } from '@/services';
//
import { useUploadImage } from '@/services/images/upload';
import ContactInformation from './_components/ContactInformation';
import ProfileHeader from './_components/ProfileHeader';
import Security from './_components/Security';

function formatDate(dateIso?: string): string {
  if (!dateIso) {
    return '-';
  }
  const d = new Date(dateIso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

const SUPABASE_STORAGE_URL = 'https://ecupkgoliskuhacfxrzx.supabase.co/storage/v1/object/public/';

export default function ProfilePageContent() {
  const { data: user, isLoading, error } = useUserProfile();
  const { uploadImage, isPending: isUploading } = useUploadImage();
  const updateProfileMutation = useUpdateProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileSchema) as Resolver<ProfileFormValues>,
    defaultValues: {
      fullname: '',
      phone: undefined,
      userAddress: undefined,
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    if (!user) {
      return;
    }
    form.reset({
      fullname: user.user_metadata?.fullname || user.fullname || '',
      userAddress: user.userAddress || user.user_metadata?.userAddress || '',
      phone: user.phone ? `+${user.phone}` : undefined,
    });
  }, [user, form]);

  const handleChangePicture = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Error',
        description: 'Please select a valid image file',
        variant: 'error',
      });
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      // Upload image
      const response = await uploadImage(file);

      if (response.error === '00' && response.data?.r2_key) {
        // Construct avatar URL
        const avatarUrl = `${SUPABASE_STORAGE_URL}${response.data.r2_key}`;

        // Update profile with new avatar URL
        await updateProfileMutation.mutateAsync({
          picture: avatarUrl,
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
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (user) {
      form.reset({
        fullname: user.user_metadata?.fullname || user.fullname || '',
        userAddress: user.userAddress || user.user_metadata?.userAddress || '',
        phone: user.phone || '',
      });
    }
    setIsEditing(false);
  };

  const onSubmit: SubmitHandler<ProfileFormValues> = async (values) => {
    try {
      await updateProfileMutation.mutateAsync({
        fullname: values.fullname,
        userAddress: values.userAddress,
        phone: values.phone,
      });
      toast({ title: 'Success', description: 'Profile updated successfully' });
      setIsEditing(false);
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || 'Failed to update profile', variant: 'error' });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-40 animate-pulse rounded-xl border bg-white" />
        <div className="h-40 animate-pulse rounded-xl border bg-white" />
        <div className="h-32 animate-pulse rounded-xl border bg-white" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
        Failed to load profile
      </div>
    );
  }

  const emailVerified = Boolean(user.aud === 'authenticated');
  const phoneVerified = Boolean(user.identities?.[0]?.identity_data?.phone_verified);

  // Get avatar URL - use preview if uploading, otherwise use user picture
  const avatarUrl = previewUrl || user.picture;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="absolute top-1/2 left-1/2 mx-auto w-full -translate-x-1/2 -translate-y-1/2 space-y-6 rounded-xl bg-white shadow-md md:w-2xl lg:w-2xl">
        <ProfileHeader
          isEditing={isEditing}
          onStartEdit={handleStartEdit}
          onCancelEdit={handleCancelEdit}
          isSaving={updateProfileMutation.isPending}
          isUploading={isUploading}
          onTriggerUpload={handleChangePicture}
          onFileChange={handleFileChange}
          fileInput={fileInputRef}
          avatarUrl={avatarUrl}
          emailVerified={emailVerified}
          createdAt={formatDate(user.createdAt)}
          role={user.role}
          displayName={user.user_metadata?.fullname || user.fullname || 'User'}
          form={form}
        />

        <ContactInformation
          isEditing={isEditing}
          form={form}
          email={user.email}
          emailConfirmedAt={formatDate(user.email_confirmed_at)}
          phone={user.phone}
          phoneVerified={phoneVerified}
        />

        <Security provider={user.app_metadata?.provider || user.provider} />
      </form>
    </Form>
  );
}
