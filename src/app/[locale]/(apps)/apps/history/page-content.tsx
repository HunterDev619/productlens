'use client';

import { Input } from '@/components/ui';
import { Button } from '@/components/ui/components/button';
import type { ProductSpecification } from '@/services/product-specifications/list';
import { useGetProductSpecificationsList } from '@/services/product-specifications/list';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2, Search, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ProductCard } from './_components/product-card';

export default function HistoryPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read initial values from URL query params
  const pageFromUrl = searchParams.get('page');
  const limitFromUrl = searchParams.get('limit');
  const qFromUrl = searchParams.get('q');

  const [currentPage, setCurrentPage] = useState(
    pageFromUrl ? Number.parseInt(pageFromUrl, 10) : 1,
  );
  const [itemsPerPage, setItemsPerPage] = useState(
    limitFromUrl ? Number.parseInt(limitFromUrl, 10) : 20,
  );
  const [searchQuery, setSearchQuery] = useState(qFromUrl || '');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(qFromUrl || '');

  // Debounce search query (wait 500ms after user stops typing)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1); // Reset to first page when search query changes
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Update URL query params when page, limit, or debounced search query changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (currentPage > 1) {
      params.set('page', currentPage.toString());
    } else {
      params.delete('page');
    }

    if (itemsPerPage !== 20) {
      params.set('limit', itemsPerPage.toString());
    } else {
      params.delete('limit');
    }

    if (debouncedSearchQuery && debouncedSearchQuery.trim()) {
      params.set('q', debouncedSearchQuery.trim());
    } else {
      params.delete('q');
    }

    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    router.replace(newUrl, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, itemsPerPage, debouncedSearchQuery]);

  const { data, isLoading, error } = useGetProductSpecificationsList({
    page: currentPage,
    limit: itemsPerPage,
    q: debouncedSearchQuery || undefined,
  });

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <motion.h1
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl"
        >
          Product History
        </motion.h1>

        {data?.pagination && (
          <div className="text-xs text-gray-600 sm:text-sm">
            <span className="hidden sm:inline">
              Showing
              {' '}
              {((currentPage - 1) * itemsPerPage) + 1}
              {' '}
              -
              {' '}
              {Math.min(currentPage * itemsPerPage, data.pagination.total)}
              {' '}
              of
              {' '}
              {data.pagination.total}
              {' '}
              products
            </span>
            <span className="sm:hidden">
              {((currentPage - 1) * itemsPerPage) + 1}
              {' '}
              -
              {' '}
              {Math.min(currentPage * itemsPerPage, data.pagination.total)}
              {' '}
              /
              {' '}
              {data.pagination.total}
            </span>
          </div>
        )}
      </div>

      {/* Search and Items per page */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search bar */}
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={e => handleSearchChange(e.target.value)}
            className="w-full pr-10 pl-10"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Items per page selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-600 sm:text-sm">Show:</span>
          <select
            value={itemsPerPage}
            onChange={e => handleItemsPerPageChange(Number(e.target.value))}
            className="rounded border border-gray-300 bg-white px-2 py-1 text-xs transition-colors hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none sm:text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="text-xs text-gray-600 sm:text-sm">
            <span className="hidden sm:inline">products per page</span>
            <span className="sm:hidden">per page</span>
          </span>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="py-12 text-center">
          <p className="text-red-600">An error occurred while loading data. Please try again.</p>
        </div>
      )}

      {/* Products grid */}
      {data?.records && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4"
        >
          {data.records.map((product: ProductSpecification, index: number) => {
            // Parse PostgreSQL array format like "{80.00,100.00}" to [80, 100]
            let parsedMarketPrice: number[] = [];
            if (product.marketPrice) {
              if (Array.isArray(product.marketPrice)) {
                parsedMarketPrice = product.marketPrice.map(p => typeof p === 'number' ? p : parseFloat(p));
              } else if (typeof product.marketPrice === 'string') {
                // Handle PostgreSQL array string format "{80.00,100.00}"
                const cleaned = product.marketPrice.replace(/[{}]/g, '');
                parsedMarketPrice = cleaned.split(',').map(p => parseFloat(p.trim())).filter(p => !isNaN(p));
              } else if (typeof product.marketPrice === 'number') {
                parsedMarketPrice = [product.marketPrice];
              }
            }

            return (
              <motion.div
                key={product.productSpecificationId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="h-full"
              >
                <ProductCard
                  id={product.productSpecificationId}
                  productName={product.productGeneralName || product.productName}
                  manufacturer={product.manufacturer || ''}
                  marketPrice={parsedMarketPrice}
                  totalWeight={product.totalWeight || ''}
                  totalWeightUnit={product.totalWeightUnit || ''}
                  categoryName={Array.isArray(product.categoryName) ? product.categoryName : [product.categoryName]}
                  verificationStatus={product.verificationStatus || ''}
                  confidenceScore={product.confidenceScore || ''}
                  imageId={product.imageId as string}
                />
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Empty state */}
      {data?.records && data.records?.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-gray-600">
            {debouncedSearchQuery
              ? `No products found matching "${debouncedSearchQuery}".`
              : 'No products found.'}
          </p>
        </div>
      )}

      {/* Pagination */}
      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex flex-col items-center gap-4 pt-4 sm:flex-row sm:justify-center sm:gap-2 sm:pt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="w-full sm:w-auto"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="ml-1 sm:ml-2">Previous</span>
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, data.pagination.totalPages) }, (_, i) => {
              let pageNumber;
              if (data.pagination.totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= data.pagination.totalPages - 2) {
                pageNumber = data.pagination.totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handlePageChange(pageNumber)}
                  className="h-8 min-w-8 px-2 sm:w-8 sm:p-0"
                >
                  {pageNumber}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= data.pagination.totalPages}
            className="w-full sm:w-auto"
          >
            <span className="mr-1 sm:mr-2">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
