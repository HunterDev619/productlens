'use client';

import type { UseFormReturn } from 'react-hook-form';
import type { ProfileFormValues } from '@/schemas/profile';
import { EnvelopeSimple, MapPin, Phone, ShieldCheck, ShieldWarning } from '@phosphor-icons/react';
import { FormControl, FormField, FormItem, FormMessage, Input } from '@/components/ui';

type Props = {
  isEditing: boolean;
  form: UseFormReturn<ProfileFormValues>;
  email: string;
  emailConfirmedAt?: string;
  phone: string | undefined | null;
  phoneVerified: boolean;
};

export default function ContactInformation({ isEditing, form, email, emailConfirmedAt, phone, phoneVerified }: Props) {
  return (
    <div className="p-6">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
        <EnvelopeSimple size={18} className="text-gray-600" />
        Contact Information
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <EnvelopeSimple size={14} className="text-gray-400" />
            Email
          </div>
          <div className="mt-1 text-gray-900">{email}</div>
          <div className="mt-1 text-xs text-gray-500">
            Confirmed on
            {emailConfirmedAt || '-'}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                <Phone size={14} className="text-gray-400" />
                Phone
              </div>
              {!isEditing
                ? (
                    <div className="mt-1 text-gray-900">{ phone ? `+${phone}` : '-'}</div>
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
              <div className={`mt-1 inline-flex items-center gap-1 text-xs ${phoneVerified ? 'text-green-700' : 'text-yellow-700'}`}>
                {phoneVerified ? <ShieldCheck size={14} /> : <ShieldWarning size={14} />}
                {phoneVerified ? 'Verified' : 'Unverified'}
              </div>
            </div>
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <MapPin size={14} className="text-gray-400" />
            Address
          </div>
          {!isEditing
            ? (
                <div className="mt-1 text-gray-900">{form.getValues('userAddress') || '-'}</div>
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
                            placeholder="Your address"
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
  );
}
