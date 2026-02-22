'use client';

import type { Table } from '@tanstack/react-table';
import { cn } from '@/utils';

type TablePaginationProps<TData> = {
  table: Table<TData>;
};

export default function TablePagination<TData>({ table }: TablePaginationProps<TData>) {
  if (table.getRowModel().rows.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4">
      <div className="text-sm text-gray-600">
        Showing
        {' '}
        <span className="font-medium">
          {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
        </span>
        {' '}
        to
        {' '}
        <span className="font-medium">
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length,
          )}
        </span>
        {' '}
        of
        {' '}
        <span className="font-medium">{table.getFilteredRowModel().rows.length}</span>
        {' '}
        results
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: table.getPageCount() }, (_, i) => i).map((pageNum) => {
            const isCurrentPage = pageNum === table.getState().pagination.pageIndex;
            const showPage
              = pageNum === 0
                || pageNum === table.getPageCount() - 1
                || Math.abs(pageNum - table.getState().pagination.pageIndex) <= 1;

            if (!showPage) {
              if (
                pageNum === 1
                && table.getState().pagination.pageIndex > 2
              ) {
                return <span key={pageNum} className="px-2 text-gray-400">...</span>;
              }
              if (
                pageNum === table.getPageCount() - 2
                && table.getState().pagination.pageIndex < table.getPageCount() - 3
              ) {
                return <span key={pageNum} className="px-2 text-gray-400">...</span>;
              }
              return null;
            }

            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => table.setPageIndex(pageNum)}
                className={cn(
                  'rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium transition-colors',
                  isCurrentPage
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100',
                )}
              >
                {pageNum + 1}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
