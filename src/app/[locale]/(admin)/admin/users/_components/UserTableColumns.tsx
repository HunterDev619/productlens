'use client';

import type { User } from '@/services/types';
import { createColumnHelper } from '@tanstack/react-table';
import { Button } from '@/components/ui';

const columnHelper = createColumnHelper<User>();

export const createUserTableColumns = (
  onUserClick: (user: User) => void,
  onPromote: (userId: string) => Promise<void> | void,
  onDemote: (userId: string) => Promise<void> | void,
  loadingUserId?: string,
) => [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: info => (
      <button
        type="button"
        onClick={() => onUserClick(info.row.original)}
        className="cursor-pointer font-mono text-xs text-blue-600 transition-colors hover:text-blue-800 hover:underline"
      >
        {info.getValue().slice(0, 8)}
        ...
      </button>
    ),
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: info => (
      <span className="text-gray-900">
        {info.getValue() || '-'}
      </span>
    ),
  }),
  columnHelper.accessor('fullname', {
    header: 'Full Name',
    cell: info => (
      <span className="text-gray-900">
        {info.getValue() || '-'}
      </span>
    ),
  }),
  columnHelper.accessor('phone', {
    header: 'Phone',
    cell: info => (
      <span className="text-gray-900">
        {info.getValue() || '-'}
      </span>
    ),
  }),
  columnHelper.accessor('userAddress', {
    header: 'Address',
    cell: info => (
      <span className="max-w-[280px] truncate text-gray-900" title={info.getValue() || ''}>
        {info.getValue() || '-'}
      </span>
    ),
  }),
  columnHelper.accessor('provider', {
    header: 'Provider',
    cell: info => (
      <span className={`rounded-full px-2 py-1 text-xs font-medium ${
        info.getValue() === 'email'
          ? 'bg-blue-100 text-blue-800'
          : 'bg-green-100 text-green-800'
      }`}
      >
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor('role', {
    header: 'Role',
    cell: info => (
      <span className={`rounded-full px-2 py-1 text-xs font-medium ${
        info.getValue() === 'ADMIN'
          ? 'bg-purple-100 text-purple-800'
          : 'bg-gray-100 text-gray-800'
      }`}
      >
        {info.getValue()}
      </span>
    ),
  }),
  // Status column now reflects email verification status
  columnHelper.display({
    id: 'status',
    header: 'Status',
    cell: (info) => {
      const verified = !!info.row.original.user_metadata?.email_verified;
      return (
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${
          verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}
        >
          {verified ? 'Verified' : 'Unverified'}
        </span>
      );
    },
  }),
  columnHelper.accessor('twoFactorEnabled', {
    header: '2FA',
    cell: info => (
      <span className={`rounded-full px-2 py-1 text-xs font-medium ${
        info.getValue()
          ? 'bg-green-100 text-green-800'
          : 'bg-gray-100 text-gray-800'
      }`}
      >
        {info.getValue() ? 'Enabled' : 'Disabled'}
      </span>
    ),
  }),
  columnHelper.accessor('locale', {
    header: 'Language',
    cell: info => (
      <span className="text-gray-600">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor('createdAt', {
    header: 'Created At',
    cell: info => (
      <span className="text-gray-600">
        {new Date(info.getValue()).toLocaleDateString('en-US')}
      </span>
    ),
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Admin',
    cell: (info) => {
      const user = info.row.original;
      const isAdmin = user.role === 'ADMIN';
      const isLoading = loadingUserId === user.id;
      return (
        <div className="flex items-center gap-2">
          {!isAdmin
            ? (
                <Button
                  type="button"
                  onClick={() => onPromote(user.id)}
                  disabled={isLoading}
                  className="w-24"
                >
                  {isLoading ? 'Activating...' : 'Activate'}
                </Button>
              )
            : (
                <Button
                  type="button"
                  onClick={() => onDemote(user.id)}
                  disabled={isLoading}
                  className="w-24"
                >
                  {isLoading ? 'Removing...' : 'Remove'}
                </Button>
              )}
        </div>
      );
    },
  }),
];
