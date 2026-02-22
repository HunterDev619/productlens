'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { Reference } from '@/services/types';
import { CalendarBlank, Link as LinkIcon, Pencil, Trash } from '@phosphor-icons/react';
import dayjs from 'dayjs';
import { Button } from '@/components/ui';
import { cn } from '@/utils';

type TableColumnsProps = {
  getCategoryName: (categoryId: string) => string;
  onEdit: (reference: Reference) => void;
  onDelete: (reference: Reference) => void;
};

export function createTableColumns({
  getCategoryName,
  onEdit,
  onDelete,
}: TableColumnsProps): ColumnDef<Reference>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return <span className="font-semibold text-gray-900">{value}</span>;
      },
    },
    {
      accessorKey: 'categoryId',
      header: 'Category',
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return (
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
            {getCategoryName(value)}
          </span>
        );
      },
    },
    {
      accessorKey: 'description',
      header: 'Description',
      size: 250,
      cell: ({ getValue }) => {
        const value = getValue() as string | null | undefined;
        return value
          ? (
              <div className="max-w-[250px]">
                <span className="line-clamp-2 text-sm text-gray-600" title={value}>
                  {value}
                </span>
              </div>
            )
          : (
              <span className="text-gray-400">—</span>
            );
      },
    },
    {
      accessorKey: 'url',
      header: 'URL',
      cell: ({ getValue }) => {
        const value = getValue() as string | null | undefined;
        return value
          ? (
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                <LinkIcon size={14} />
                <span className="max-w-xs truncate">{value}</span>
              </a>
            )
          : (
              <span className="text-gray-400">—</span>
            );
      },
    },
    {
      accessorKey: 'isPublic',
      header: 'Public',
      cell: ({ getValue }) => {
        const value = getValue() as boolean;
        return (
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-xs font-medium',
              value
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700',
            )}
          >
            {value ? 'Yes' : 'No'}
          </span>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ getValue }) => {
        const date = getValue() as string;
        return (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <CalendarBlank size={14} className="text-gray-400" />
            {dayjs(date).format('MMM D, YYYY')}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(row.original)}
          >
            <Pencil size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(row.original)}
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <Trash size={16} />
          </Button>
        </div>
      ),
    },
  ];
}
