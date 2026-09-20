import { useState, useMemo, useCallback } from 'react';
import type { LifeActivity, FilterState, LifeSource } from '@/types';

const DEFAULT_FILTER: FilterState = {
  search: '',
  sources: [],
  categories: [],
  dateRange: { start: null, end: null },
  sortBy: 'date-desc',
};

export function useFilters(activities: LifeActivity[]) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTER);

  const filtered = useMemo(() => {
    let result = activities;

    // Search
    if (filters.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(
        a =>
          a.title.toLowerCase().includes(query) ||
          a.category?.toLowerCase().includes(query) ||
          a.description?.toLowerCase().includes(query) ||
          a.location?.toLowerCase().includes(query) ||
          a.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    // Source filter
    if (filters.sources.length > 0) {
      result = result.filter(a => filters.sources.includes(a.source));
    }

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter(a => a.category && filters.categories.includes(a.category));
    }

    // Date range
    if (filters.dateRange.start) {
      result = result.filter(a => a.timestamp >= filters.dateRange.start!);
    }
    if (filters.dateRange.end) {
      result = result.filter(a => a.timestamp <= filters.dateRange.end! + 'T23:59:59');
    }

    // Sort
    result = [...result].sort((a, b) => {
      switch (filters.sortBy) {
        case 'date-desc':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'date-asc':
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        case 'amount-desc':
          return (b.amount ?? 0) - (a.amount ?? 0);
        case 'amount-asc':
          return (a.amount ?? 0) - (b.amount ?? 0);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return result;
  }, [activities, filters]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    for (const a of activities) {
      if (a.category) cats.add(a.category);
    }
    return [...cats].sort();
  }, [activities]);

  const setSearch = useCallback((search: string) => {
    setFilters(f => ({ ...f, search }));
  }, []);

  const toggleSource = useCallback((source: LifeSource) => {
    setFilters(f => ({
      ...f,
      sources: f.sources.includes(source)
        ? f.sources.filter(s => s !== source)
        : [...f.sources, source],
    }));
  }, []);

  const toggleCategory = useCallback((category: string) => {
    setFilters(f => ({
      ...f,
      categories: f.categories.includes(category)
        ? f.categories.filter(c => c !== category)
        : [...f.categories, category],
    }));
  }, []);

  const setDateRange = useCallback((start: string | null, end: string | null) => {
    setFilters(f => ({ ...f, dateRange: { start, end } }));
  }, []);

  const setSortBy = useCallback((sortBy: FilterState['sortBy']) => {
    setFilters(f => ({ ...f, sortBy }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTER);
  }, []);

  const hasActiveFilters = filters.search !== '' ||
    filters.sources.length > 0 ||
    filters.categories.length > 0 ||
    filters.dateRange.start !== null ||
    filters.dateRange.end !== null;

  return {
    filters,
    filtered,
    categories,
    setSearch,
    toggleSource,
    toggleCategory,
    setDateRange,
    setSortBy,
    resetFilters,
    hasActiveFilters,
  };
}
