'use client';

import type { ColumnDef, ColumnFiltersState, SortingState } from '@tanstack/react-table';
import type { CreateCategoryPayload } from '@/services/admin/categories/create';
import type { Category } from '@/services/types';
import { ArrowDown, ArrowsDownUp, ArrowUp, CalendarBlank, CircleNotch, MagnifyingGlass, Pencil, Plus, Tag, Trash } from '@phosphor-icons/react';
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
import { useMemo, useState } from 'react';
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input, Label } from '@/components/ui';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/components/alert-dialog';
import { useAdminCreateCategory } from '@/services/admin/categories/create';
import { useAdminDeleteCategory } from '@/services/admin/categories/delete';
import { useAdminListCategories } from '@/services/admin/categories/list';
import { useAdminUpdateCategory } from '@/services/admin/categories/update';
import { cn } from '@/utils';

export default function CategoriesPageContent() {
  const { data: categoriesData, isLoading: isCategoriesLoading } = useAdminListCategories();
  const { createCategory, isPending: isCreating } = useAdminCreateCategory();
  const { mutateAsync: updateCategory, isPending: isUpdating } = useAdminUpdateCategory();
  const { mutateAsync: deleteCategory, isPending: isDeleting } = useAdminDeleteCategory();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState<CreateCategoryPayload>({
    title: '',
    icon: '',
    color: '',
  });

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      icon: '',
      color: '',
    });
  };

  // Handle create
  const handleCreate = async () => {
    if (!formData.title.trim()) {
      return;
    }
    try {
      await createCategory(formData);
      setIsCreateDialogOpen(false);
      resetForm();
    } catch {
      // Error is handled by the hook
    }
  };

  // Handle edit
  const handleEdit = async () => {
    if (!selectedCategoryId || !formData.title.trim()) {
      return;
    }
    try {
      await updateCategory({
        categoryId: selectedCategoryId,
        payload: formData,
      });
      setIsEditDialogOpen(false);
      setSelectedCategoryId(null);
      resetForm();
    } catch {
      // Error is handled by the hook
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedCategoryId) {
      return;
    }
    try {
      await deleteCategory(selectedCategoryId);
      setIsDeleteDialogOpen(false);
      setSelectedCategoryId(null);
    } catch {
      // Error is handled by the hook
    }
  };

  // Open edit dialog
  const openEditDialog = (category: Category) => {
    setSelectedCategoryId(category.id);
    setFormData({
      title: category.title,
      icon: category.icon || '',
      color: category.color || '',
    });
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (category: Category) => {
    setSelectedCategoryId(category.id);
    setIsDeleteDialogOpen(true);
  };

  // Define columns
  const columns = useMemo<ColumnDef<Category>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ getValue }) => {
          const value = getValue() as string;
          return <span className="font-semibold text-gray-900">{value}</span>;
        },
      },
      {
        accessorKey: 'icon',
        header: 'Icon',
        cell: ({ getValue }) => {
          const value = getValue() as string | null | undefined;
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
        accessorKey: 'color',
        header: 'Color',
        cell: ({ getValue }) => {
          const value = getValue() as string | null | undefined;
          return value
            ? (
                <div className="flex items-center gap-2">
                  <div
                    className="h-6 w-6 rounded-full border border-gray-300"
                    style={{ backgroundColor: value }}
                  />
                  <span className="text-sm text-gray-600">{value}</span>
                </div>
              )
            : (
                <span className="text-gray-400">—</span>
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
        accessorKey: 'updatedAt',
        header: 'Updated',
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
              onClick={() => openEditDialog(row.original)}
            >
              <Pencil size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => openDeleteDialog(row.original)}
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <Trash size={16} />
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: categoriesData?.data || [],
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

  if (isCategoriesLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <CircleNotch size={40} className="animate-spin text-emerald-500" />
          <p className="text-lg font-medium text-gray-700">Loading Categories...</p>
        </div>
      </div>
    );
  }

  const selectedCategory = categoriesData?.data?.find(cat => cat.id === selectedCategoryId);

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="space-y-2">
            <h1 className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-4xl font-bold text-transparent">
              Categories Management
            </h1>
            <p className="text-lg text-gray-600">
              Manage product categories with icons and colors
            </p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setIsCreateDialogOpen(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus size={20} className="mr-2" />
            Create Category
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-4 md:grid-cols-3"
        >
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Categories</p>
                <p className="mt-2 text-3xl font-bold text-emerald-600">
                  {categoriesData?.data?.length || 0}
                </p>
              </div>
              <Tag size={40} className="text-emerald-500" weight="duotone" />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">With Icons</p>
                <p className="mt-2 text-3xl font-bold text-blue-600">
                  {categoriesData?.data?.filter(cat => cat.icon).length || 0}
                </p>
              </div>
              <Tag size={40} className="text-blue-500" weight="duotone" />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">With Colors</p>
                <p className="mt-2 text-3xl font-bold text-purple-600">
                  {categoriesData?.data?.filter(cat => cat.color).length || 0}
                </p>
              </div>
              <Tag size={40} className="text-purple-500" weight="duotone" />
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
              placeholder="Search categories by title, icon, color..."
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
                            <Tag size={48} className="text-gray-300" weight="duotone" />
                            <p className="text-lg font-medium text-gray-500">No categories found</p>
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
          )}
        </motion.div>

        {/* Create Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Category</DialogTitle>
              <DialogDescription>
                Add a new category with title, icon, and color
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Category title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Icon</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={e => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="Icon name or code"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="color"
                    type="color"
                    value={formData.color || '#3b82f6'}
                    onChange={e => setFormData({ ...formData, color: e.target.value })}
                    className="h-10 w-20 cursor-pointer"
                  />
                  <Input
                    value={formData.color}
                    onChange={e => setFormData({ ...formData, color: e.target.value })}
                    placeholder="#3b82f6"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={isCreating || !formData.title.trim()}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isCreating
                  ? (
                      <>
                        <CircleNotch size={16} className="mr-2 animate-spin" />
                        Creating...
                      </>
                    )
                  : (
                      'Create'
                    )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>
                Update category information
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Category title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-icon">Icon</Label>
                <Input
                  id="edit-icon"
                  value={formData.icon}
                  onChange={e => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="Icon name or code"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-color">Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="edit-color"
                    type="color"
                    value={formData.color || '#3b82f6'}
                    onChange={e => setFormData({ ...formData, color: e.target.value })}
                    className="h-10 w-20 cursor-pointer"
                  />
                  <Input
                    value={formData.color}
                    onChange={e => setFormData({ ...formData, color: e.target.value })}
                    placeholder="#3b82f6"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setSelectedCategoryId(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEdit}
                disabled={isUpdating || !formData.title.trim()}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isUpdating
                  ? (
                      <>
                        <CircleNotch size={16} className="mr-2 animate-spin" />
                        Updating...
                      </>
                    )
                  : (
                      'Update'
                    )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the category
                {' '}
                <span className="font-semibold">{selectedCategory?.title}</span>
                .
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setSelectedCategoryId(null);
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting
                  ? (
                      <>
                        <CircleNotch size={16} className="mr-2 animate-spin" />
                        Deleting...
                      </>
                    )
                  : (
                      'Delete'
                    )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
