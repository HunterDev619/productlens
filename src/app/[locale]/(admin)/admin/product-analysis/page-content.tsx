'use client';

import type { ColumnDef, ColumnFiltersState, SortingState } from '@tanstack/react-table';
import type { ProductSpecification } from '@/services/admin/product-specifications/list';
import { ArrowDown, ArrowsDownUp, ArrowUp, CalendarBlank, CircleNotch, Eye, MagnifyingGlass, Package, Scales, Tag } from '@phosphor-icons/react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui';
import { useAdminProductSpecificationsList } from '@/services/admin/product-specifications/list';
import { cn } from '@/utils';

export const ProductAnalysisPageContent = () => {
  const { data: productSpecifications, isLoading: isProductSpecificationsLoading } = useAdminProductSpecificationsList();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  // Define columns
  const columns = useMemo<ColumnDef<ProductSpecification>[]>(
    () => [
      {
        accessorKey: 'productName',
        header: 'Product Name',
        cell: ({ row }) => (
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-gray-900">{row.original.productGeneralName}</span>
            {/* {row.original.productName && (
              <span className="text-xs text-gray-500">{row.original.productName}</span>
            )} */}
          </div>
        ),
      },
      {
        accessorKey: 'userId',
        header: 'User ID',
        cell: ({ getValue }) => {
          const value = getValue() as string | undefined;
          return value
            ? (
                <span className="rounded-md bg-blue-100 px-2 py-1 font-mono text-xs text-blue-700">
                  {value}
                </span>
              )
            : (
                <span className="text-gray-400">—</span>
              );
        },
      },
      {
        accessorKey: 'manufacturer',
        header: 'Manufacturer',
        cell: ({ getValue }) => {
          const value = getValue() as string | undefined;
          return value || <span className="text-gray-400">—</span>;
        },
      },
      {
        accessorKey: 'skuNumber',
        header: 'SKU',
        cell: ({ getValue }) => {
          const value = getValue() as string | undefined;
          return value
            ? (
                <span className="rounded-md bg-gray-100 px-2 py-1 font-mono text-xs text-gray-700">
                  {value}
                </span>
              )
            : (
                <span className="text-gray-400">—</span>
              );
        },
      },
      {
        accessorKey: 'categoryName',
        header: 'Category',
        cell: ({ getValue }) => {
          const categories = getValue() as string[] | undefined;
          return categories && categories.length > 0
            ? (
                <div className="flex flex-wrap gap-1">
                  {categories.slice(0, 2).map(cat => (
                    <span
                      key={cat}
                      className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700"
                    >
                      {cat}
                    </span>
                  ))}
                  {categories.length > 2 && (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                      +
                      {categories.length - 2}
                    </span>
                  )}
                </div>
              )
            : (
                <span className="text-gray-400">—</span>
              );
        },
      },
      {
        accessorKey: 'totalWeight',
        header: 'Weight',
        cell: ({ row }) => {
          const weight = row.original.totalWeight;
          const unit = row.original.totalWeightUnit;
          return weight
            ? (
                <div className="flex items-center gap-1 text-sm">
                  <Scales size={14} className="text-gray-400" />
                  <span>
                    {weight}
                    {' '}
                    {unit}
                  </span>
                </div>
              )
            : (
                <span className="text-gray-400">—</span>
              );
        },
      },
      {
        accessorKey: 'marketPrice',
        header: 'Price Range',
        cell: ({ getValue }) => {
          const prices = getValue() as string[] | undefined;
          return prices && prices.length >= 2
            ? (
                <span className="font-medium text-green-600">
                  $
                  {prices[0]}
                  {' '}
                  - $
                  {prices[1]}
                </span>
              )
            : (
                <span className="text-gray-400">—</span>
              );
        },
      },
      {
        accessorKey: 'verificationStatus',
        header: 'Status',
        cell: ({ getValue }) => {
          const status = getValue() as string;
          return (
            <span
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium',
                status === 'verified'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-amber-100 text-amber-700',
              )}
            >
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: 'confidenceScore',
        header: 'Confidence',
        cell: ({ getValue }) => {
          const score = getValue() as string;
          const numScore = Number.parseFloat(score);
          return (
            <div className="flex items-center gap-2">
              <div className="h-2 w-20 overflow-hidden rounded-full bg-gray-200">
                <div
                  className={cn(
                    'h-full transition-all',
                    numScore >= 0.8 ? 'bg-green-500' : numScore >= 0.6 ? 'bg-amber-500' : 'bg-red-500',
                  )}
                  style={{ width: `${numScore * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-600">
                {(numScore * 100).toFixed(0)}
                %
              </span>
            </div>
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
        cell: row => (
          <Link href={`/admin/product-analysis/${row.row.original.id}`}>
            <Button variant="outline" size="sm">
              <Eye size={16} />
              View
            </Button>
          </Link>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: productSpecifications?.data || [],
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  if (isProductSpecificationsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <CircleNotch size={40} className="animate-spin text-emerald-500" />
          <p className="text-lg font-medium text-gray-700">Loading Product Specifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-4xl font-bold text-transparent">
            Product Analysis Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Manage and analyze product specifications with comprehensive sustainability insights
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-4 md:grid-cols-4"
        >
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="mt-2 text-3xl font-bold text-emerald-600">
                  {productSpecifications?.pagination?.total || 0}
                </p>
              </div>
              <Package size={40} className="text-emerald-500" weight="duotone" />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verified</p>
                <p className="mt-2 text-3xl font-bold text-green-600">
                  {productSpecifications?.data?.filter(p => p.verificationStatus === 'verified').length || 0}
                </p>
              </div>
              <Tag size={40} className="text-green-500" weight="duotone" />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unverified</p>
                <p className="mt-2 text-3xl font-bold text-amber-600">
                  {productSpecifications?.data?.filter(p => p.verificationStatus === 'unverified').length || 0}
                </p>
              </div>
              <Tag size={40} className="text-amber-500" weight="duotone" />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-sky-50 to-blue-50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Confidence</p>
                <p className="mt-2 text-3xl font-bold text-sky-600">
                  {productSpecifications?.data
                    ? `${(
                      (productSpecifications.data.reduce((acc, p) => acc + Number.parseFloat(p.confidenceScore), 0)
                        / productSpecifications.data.length)
                      * 100
                    ).toFixed(0)}%`
                    : '0%'}
                </p>
              </div>
              <Scales size={40} className="text-sky-500" weight="duotone" />
            </div>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="relative">
            <MagnifyingGlass
              size={20}
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder="Search products by name, manufacturer, SKU..."
              className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 py-3 pr-4 pl-12 transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:outline-none"
            />
          </div>
        </motion.div>

        {/* Table */}
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
                            <td key={cell.id} className="px-6 py-4 text-sm text-gray-900">
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
                            <Package size={48} className="text-gray-300" weight="duotone" />
                            <p className="text-lg font-medium text-gray-500">No products found</p>
                            <p className="text-sm text-gray-400">Try adjusting your search filters</p>
                          </div>
                        </td>
                      </tr>
                    )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {table.getRowModel().rows.length > 0 && (
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
                          'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                          isCurrentPage
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300',
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
          )}
        </motion.div>
      </div>
    </div>
  );
};
