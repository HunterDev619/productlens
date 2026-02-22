'use client';

import type { ColumnDef, Table as TanStackTable } from '@tanstack/react-table';
import type { Reference } from '@/services/types';
import { ArrowDown, ArrowsDownUp, ArrowUp, Tag } from '@phosphor-icons/react';
import { flexRender } from '@tanstack/react-table';
import { motion } from 'framer-motion';
import { cn } from '@/utils';
import TablePagination from './table-pagination';

type ReferencesTableProps = {
  table: TanStackTable<Reference>;
  columns: ColumnDef<Reference>[];
};

export default function ReferencesTable({ table, columns }: ReferencesTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-700"
                    style={{
                      width: header.column.columnDef.size ? `${header.column.columnDef.size}px` : 'auto',
                      maxWidth: header.column.columnDef.size ? `${header.column.columnDef.size}px` : 'none',
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : (
                          <div
                            className={cn(
                              'flex items-center gap-2',
                              header.column.getCanSort() && 'cursor-pointer select-none',
                            )}
                            onClick={header.column.getToggleSortingHandler()}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                header.column.getToggleSortingHandler()?.(e as any);
                              }
                            }}
                            role={header.column.getCanSort() ? 'button' : undefined}
                            tabIndex={header.column.getCanSort() ? 0 : undefined}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getCanSort() && (
                              <span className="text-gray-400">
                                {header.column.getIsSorted() === 'asc'
                                  ? <ArrowUp size={16} weight="bold" />
                                  : header.column.getIsSorted() === 'desc'
                                    ? <ArrowDown size={16} weight="bold" />
                                    : <ArrowsDownUp size={16} />}
                              </span>
                            )}
                          </div>
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-100">
            {table.getRowModel().rows.length > 0
              ? (
                  table.getRowModel().rows.map(row => (
                    <tr
                      key={row.id}
                      className="transition-colors hover:bg-emerald-50/50"
                    >
                      {row.getVisibleCells().map(cell => (
                        <td
                          key={cell.id}
                          className="px-6 py-4 text-sm text-gray-900"
                          style={{
                            width: cell.column.columnDef.size ? `${cell.column.columnDef.size}px` : 'auto',
                            maxWidth: cell.column.columnDef.size ? `${cell.column.columnDef.size}px` : 'none',
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                )
              : (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Tag size={48} className="text-gray-300" weight="duotone" />
                        <p className="text-lg font-medium text-gray-500">No references found</p>
                        <p className="text-sm text-gray-400">Try adjusting your search filters</p>
                      </div>
                    </td>
                  </tr>
                )}
          </tbody>
        </table>
      </div>

      <TablePagination table={table} />
    </motion.div>
  );
}
