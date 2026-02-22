'use client';

import { useListCategories } from '@/services/categories/list';
import { useListPublicReferences } from '@/services/public-references/list';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  CategoryFilter,
  EmptyState,
  LoadingState,
  ReferencesGrid,
  ReferencesHeader,
  ReferencesPagination,
  ReferencesSearch,
} from './_components';

const ITEMS_PER_PAGE = 12;

export default function ReferencesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read initial values from URL query params
  const pageFromUrl = searchParams.get('page');
  const qFromUrl = searchParams.get('q');
  const categoryFromUrl = searchParams.get('category');

  const [currentPage, setCurrentPage] = useState(
    pageFromUrl ? Number.parseInt(pageFromUrl, 10) : 1,
  );
  const [searchQuery, setSearchQuery] = useState(qFromUrl || '');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(qFromUrl || '');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(categoryFromUrl || null);

  // Debounce search query (wait 500ms after user stops typing)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1); // Reset to first page when search query changes
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Update URL query params when page, limit, search query, or category changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (currentPage > 1) {
      params.set('page', currentPage.toString());
    } else {
      params.delete('page');
    }

    if (debouncedSearchQuery && debouncedSearchQuery.trim()) {
      params.set('q', debouncedSearchQuery.trim());
    } else {
      params.delete('q');
    }

    if (selectedCategoryId) {
      params.set('category', selectedCategoryId);
    } else {
      params.delete('category');
    }

    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    router.replace(newUrl, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, debouncedSearchQuery, selectedCategoryId]);

  const { data: referencesData, isLoading: isReferencesLoading } = useListPublicReferences();
  const { data: categoriesData, isLoading: isCategoriesLoading } = useListCategories();

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get category by ID
  const getCategory = useMemo(() => {
    return (categoryId: string) => {
      const category = categoriesData?.data?.find(cat => cat.id === categoryId);
      return category || null;
    };
  }, [categoriesData]);

  // Filter references client-side
  const filteredReferences = useMemo(() => {
    if (!referencesData?.data) {
      return [];
    }

    let filtered = referencesData.data;

    // Filter by category
    if (selectedCategoryId) {
      filtered = filtered.filter(ref => ref.categoryId === selectedCategoryId);
    }

    // Filter by search query
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(ref =>
        ref.name.toLowerCase().includes(query)
        || ref.description?.toLowerCase().includes(query)
        || ref.url?.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [referencesData?.data, selectedCategoryId, debouncedSearchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredReferences.length / ITEMS_PER_PAGE);
  const paginatedReferences = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredReferences.slice(startIndex, endIndex);
  }, [filteredReferences, currentPage]);

  if (isReferencesLoading || isCategoriesLoading) {
    return <LoadingState />;
  }

  const totalCount = filteredReferences.length;
  const references = paginatedReferences;

  return (
    <div className="space-y-6">
      {/* Header */}
      <ReferencesHeader totalCount={totalCount} />

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        {/* Search Bar */}
        <ReferencesSearch searchQuery={searchQuery} onSearchChange={handleSearchChange} />

        {/* Category Filter */}
        {categoriesData?.data && categoriesData.data.length > 0 && (
          <CategoryFilter
            categories={categoriesData.data}
            selectedCategoryId={selectedCategoryId}
            onCategorySelect={handleCategorySelect}
          />
        )}
      </motion.div>

      {/* References Grid or Empty State */}
      {references.length > 0
        ? (
            <>
              <ReferencesGrid
                references={references}
                getCategory={getCategory}
              />
              {totalPages > 1 && (
                <ReferencesPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalCount}
                  pageSize={ITEMS_PER_PAGE}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )
        : (
            <EmptyState hasSearchOrFilter={!!(searchQuery || selectedCategoryId)} />
          )}
    </div>
  );
}
