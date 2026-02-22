'use client';

import type { SortingState } from '@tanstack/react-table';
import type { User } from '@/services';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import { DateRangePicker } from 'rsuite';
import { useDemoteUserFromAdmin } from '@/services/admin/users/demote-from-admin';
import { usePromoteUserToAdmin } from '@/services/admin/users/promote-to-admin';
import { createUserTableColumns } from './UserTableColumns';

type UserTableProps = {
  data: User[];
  onUserClickAction: (user: User) => void;
};

export function UserTable({ data, onUserClickAction }: UserTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [createdFrom, setCreatedFrom] = useState<Date | undefined>(undefined);
  const [createdTo, setCreatedTo] = useState<Date | undefined>(undefined);

  const [loadingUserId, setLoadingUserId] = useState<string | undefined>(undefined);

  const { promoteUserToAdmin } = usePromoteUserToAdmin();
  const { demoteUserFromAdmin } = useDemoteUserFromAdmin();

  const handlePromote = useCallback(async (userId: string) => {
    try {
      setLoadingUserId(userId);
      await promoteUserToAdmin(userId);
    } finally {
      setLoadingUserId(undefined);
    }
  }, [promoteUserToAdmin]);

  const handleDemote = useCallback(async (userId: string) => {
    try {
      setLoadingUserId(userId);
      await demoteUserFromAdmin(userId);
    } finally {
      setLoadingUserId(undefined);
    }
  }, [demoteUserFromAdmin]);

  const columns = useMemo(
    () => createUserTableColumns(onUserClickAction, handlePromote, handleDemote, loadingUserId),
    [onUserClickAction, handlePromote, handleDemote, loadingUserId],
  );

  const filteredData = useMemo(() => {
    if (!createdFrom && !createdTo) {
      return data;
    }
    return data.filter((u) => {
      const createdAt = new Date(u.createdAt).getTime();
      const from = createdFrom ? new Date(createdFrom).setHours(0, 0, 0, 0) : -Infinity;
      const to = createdTo ? new Date(createdTo).setHours(23, 59, 59, 999) : Infinity;
      return createdAt >= from && createdAt <= to;
    });
  }, [data, createdFrom, createdTo]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination: { pageIndex, pageSize },
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: (updater) => {
      const next = typeof updater === 'function' ? updater({ pageIndex, pageSize }) : updater;
      setPageIndex(next.pageIndex);
      setPageSize(next.pageSize);
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const pageSizeOptions = [5, 10, 20, 50];

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Filters */}
      <div className="flex flex-col gap-3 p-3 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <input
            value={globalFilter ?? ''}
            onChange={e => table.setGlobalFilter(e.target.value)}
            placeholder="Search users..."
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-inner placeholder:text-gray-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/30 focus:outline-none"
          />
        </div>
        <div className="min-w-[260px]">
          <DateRangePicker
            value={createdFrom && createdTo ? [createdFrom, createdTo] : null}
            onChange={(val) => {
              if (val && Array.isArray(val)) {
                const [start, end] = val as [Date, Date];
                setCreatedFrom(start);
                setCreatedTo(end);
              } else {
                setCreatedFrom(undefined);
                setCreatedTo(undefined);
              }
            }}
            placement="bottomEnd"
            showOneCalendar
            placeholder="Filter by created range"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="cursor-pointer px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase hover:bg-gray-100"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center space-x-1">
                      <span>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </span>
                      {header.column.getIsSorted() === 'asc' && (
                        <span className="text-gray-400">↑</span>
                      )}
                      {header.column.getIsSorted() === 'desc' && (
                        <span className="text-gray-400">↓</span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="rounded border border-gray-300 px-2 py-1 disabled:opacity-50"
          >
            « First
          </button>
          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded border border-gray-300 px-2 py-1 disabled:opacity-50"
          >
            ‹ Prev
          </button>
          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded border border-gray-300 px-2 py-1 disabled:opacity-50"
          >
            Next ›
          </button>
          <button
            type="button"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="rounded border border-gray-300 px-2 py-1 disabled:opacity-50"
          >
            Last »
          </button>
        </div>
        <div className="flex items-center gap-3">
          <span>
            Page
            {' '}
            <strong>
              {table.getState().pagination.pageIndex + 1}
              {' '}
              of
              {' '}
              {table.getPageCount() || 1}
            </strong>
          </span>
          <label className="flex items-center gap-2">
            <span>Rows per page</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
              className="rounded border border-gray-300 bg-white px-2 py-1"
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2">
            <span>Go to page</span>
            <input
              type="number"
              min={1}
              max={table.getPageCount() || 1}
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="w-20 rounded border border-gray-300 px-2 py-1"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
