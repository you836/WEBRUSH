import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Search,
  X,
  SlidersHorizontal,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Archive,
  Music,
  CreditCard,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Link2,
  Upload,
  Download
} from 'lucide-react';
import { ReceiptCard } from './ReceiptCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { EchoText } from '@/components/ui/EchoText';
import { GlassIcons, type GlassIconItem } from '@/components/ui/GlassIcons';
import { useFilters } from '@/hooks/useFilters';
import type { LifeActivity, Connection, LifeSource } from '@/types';

const PAGE_SIZE = 24;

const SOURCE_OPTIONS: { id: LifeSource; label: string; activeStyle: string }[] = [
  { id: 'music', label: 'Music Streaming', activeStyle: 'bg-music/20 text-music border-music/50 font-semibold' },
  { id: 'banking', label: 'Banking & Card', activeStyle: 'bg-banking/20 text-banking border-banking/50 font-semibold' },
  { id: 'household', label: 'Household & Daily', activeStyle: 'bg-household/20 text-household border-household/50 font-semibold' },
];

interface ArchiveExplorerProps {
  activities: LifeActivity[];
  connections: Connection[];
  onSelectActivity: (id: string) => void;
  selectedActivityId?: string | null;
  onOpenImport?: () => void;
  onOpenExport?: () => void;
}

export function ArchiveExplorer({
  activities,
  connections,
  onSelectActivity,
  selectedActivityId,
  onOpenImport,
  onOpenExport,
}: ArchiveExplorerProps) {
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const {
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
  } = useFilters(activities);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageItems = useMemo(
    () => filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    [filtered, page]
  );

  const connectionIndex = useMemo(() => {
    const index = new Set<string>();
    for (const c of connections) {
      for (const id of c.activities) index.add(id);
    }
    return index;
  }, [connections]);

  const glassIconItems: GlassIconItem[] = useMemo(() => [
    {
      icon: <Sparkles size={24} />,
      label: 'All Archive',
      color: 'green',
      isActive: filters.sources.length === 3 && !filters.search && filters.sortBy === 'date-desc',
      onClick: () => {
        resetFilters();
        setPage(0);
      }
    },
    {
      icon: <Music size={24} />,
      label: 'Spotify Streams',
      color: 'purple',
      isActive: filters.sources.length === 1 && filters.sources.includes('music'),
      onClick: () => {
        resetFilters();
        toggleSource('music');
        setPage(0);
      }
    },
    {
      icon: <CreditCard size={24} />,
      label: 'Banking & UPI',
      color: 'blue',
      isActive: filters.sources.length === 1 && filters.sources.includes('banking'),
      onClick: () => {
        resetFilters();
        toggleSource('banking');
        setPage(0);
      }
    },
    {
      icon: <ShoppingBag size={24} />,
      label: 'Daily Household',
      color: 'orange',
      isActive: filters.sources.length === 1 && filters.sources.includes('household'),
      onClick: () => {
        resetFilters();
        toggleSource('household');
        setPage(0);
      }
    },
    {
      icon: <TrendingUp size={24} />,
      label: 'Highest Spends',
      color: 'indigo',
      isActive: filters.sortBy === 'amount-desc',
      onClick: () => {
        setSortBy(filters.sortBy === 'amount-desc' ? 'date-desc' : 'amount-desc');
        setPage(0);
      }
    },
    {
      icon: <Link2 size={24} />,
      label: 'Connected Only',
      color: 'red',
      isActive: filters.search.toLowerCase() === 'connected',
      onClick: () => {
        setSearch(filters.search.toLowerCase() === 'connected' ? '' : 'connected');
        setPage(0);
      }
    }
  ], [filters, resetFilters, toggleSource, setSortBy, setSearch]);

  return (
    <div className="space-y-6 sm:space-y-8 w-full">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Archive size={18} className="text-amber" />
          <span className="text-sm font-semibold text-amber uppercase tracking-widest">Master Repository</span>
        </div>
        <div className="mb-3">
          <EchoText
            text="Unified Archive"
            fontSize="clamp(2.5rem, 6vw, 4.5rem)"
            fontWeight={700}
            color="#f5f0e8"
            tint="#e8a849"
            direction="right"
            echoes={8}
            offset={18}
            className="font-serif tracking-tight"
          />
        </div>
        <p className="text-sm sm:text-base md:text-lg text-ivory-muted mt-2 max-w-3xl leading-relaxed">
          Browse, filter, and cross-examine {activities.length.toLocaleString()} individual receipts and digital life activities across full dataset history.
        </p>

        {/* 3D Glass Icons Quick-Lens Bar */}
        <div className="pt-6 pb-2">
          <GlassIcons items={glassIconItems} />
        </div>
      </motion.div>

      {/* Search & control toolbar - Enlarged */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">

        {/* Search input */}
        <div className="relative flex-1">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-ivory-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search tracks, merchants, categories, locations, tags..."
            value={filters.search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
            className="w-full pl-12 pr-10 py-3.5 sm:py-4 bg-charcoal/90 border border-border/80 rounded-xl text-sm sm:text-base text-ivory placeholder:text-ivory-muted/50 focus:outline-none focus:border-amber/60 shadow-inner transition-colors"
            aria-label="Search archive records"
          />
          {filters.search && (
            <button
              onClick={() => { setSearch(''); setPage(0); }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-ivory-muted hover:text-ivory rounded-md transition-colors cursor-pointer"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Buttons row */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-6 py-3.5 sm:py-4 border rounded-xl text-sm sm:text-base font-semibold transition-all cursor-pointer ${
              showFilters || hasActiveFilters
                ? 'border-amber text-amber bg-amber/15 shadow-md'
                : 'border-border/80 text-ivory-muted hover:text-ivory hover:border-border-light bg-charcoal/90'
            }`}
            aria-expanded={showFilters}
            aria-label="Toggle filters panel"
          >
            <SlidersHorizontal size={18} />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2.5 h-2.5 rounded-full bg-amber animate-pulse" />
            )}
          </button>

          <select
            value={filters.sortBy}
            onChange={e => setSortBy(e.target.value as typeof filters.sortBy)}
            className="flex-1 sm:flex-none px-5 py-3.5 sm:py-4 bg-charcoal/90 border border-border/80 rounded-xl text-sm sm:text-base text-ivory font-medium appearance-none cursor-pointer focus:outline-none focus:border-amber/60 pr-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23c8c0b4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 1rem center',
            }}
            aria-label="Sort activities by"
          >
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
            <option value="amount-desc">Amount: High to Low</option>
            <option value="amount-asc">Amount: Low to High</option>
            <option value="title">Title A–Z</option>
          </select>

          {onOpenImport && (
            <button
              onClick={onOpenImport}
              className="hidden md:flex items-center gap-2 px-4 py-3.5 sm:py-4 bg-charcoal/90 hover:bg-surface border border-border/80 hover:border-amber/50 rounded-xl text-sm font-semibold text-ivory transition-all cursor-pointer shadow-sm"
              title="Import dataset"
            >
              <Upload size={16} className="text-amber" />
              <span>Import</span>
            </button>
          )}

          {onOpenExport && (
            <button
              onClick={onOpenExport}
              className="hidden md:flex items-center gap-2 px-4 py-3.5 sm:py-4 bg-charcoal/90 hover:bg-surface border border-border/80 hover:border-amber/50 rounded-xl text-sm font-semibold text-ivory transition-all cursor-pointer shadow-sm"
              title="Export dataset"
            >
              <Download size={16} className="text-amber" />
              <span>Export</span>
            </button>
          )}
        </div>
      </div>

      {/* Expanded filters panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-charcoal/90 backdrop-blur-md border border-border/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl"
        >
          {/* Source filters */}
          <div>
            <p className="text-sm sm:text-base text-ivory mb-3 font-semibold">Filter by Activity Pillar</p>
            <div className="flex flex-wrap gap-2.5">
              {SOURCE_OPTIONS.map(src => {
                const isActive = filters.sources.includes(src.id);
                return (
                  <button
                    key={src.id}
                    onClick={() => { toggleSource(src.id); setPage(0); }}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all cursor-pointer ${
                      isActive
                        ? src.activeStyle
                        : 'border-border text-ivory-muted hover:text-ivory bg-surface/50'
                    }`}
                  >
                    {src.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category filters */}
          <div>
            <p className="text-sm sm:text-base text-ivory mb-3 font-semibold">Filter by Taxonomy & Category</p>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-2">
              {categories.slice(0, 30).map(cat => {
                const isSelected = filters.categories.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => { toggleCategory(cat); setPage(0); }}
                    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber/25 text-amber border border-amber/50 font-semibold shadow-xs'
                        : 'bg-surface text-ivory-muted hover:text-ivory border border-border/50'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date range picker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/40">
            <div>
              <label className="text-xs sm:text-sm text-ivory-muted mb-1.5 block font-semibold">Start Date Filter</label>
              <input
                type="date"
                value={filters.dateRange.start ?? ''}
                onChange={e => { setDateRange(e.target.value || null, filters.dateRange.end); setPage(0); }}
                className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm text-ivory focus:outline-none focus:border-amber/50"
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm text-ivory-muted mb-1.5 block font-semibold">End Date Filter</label>
              <input
                type="date"
                value={filters.dateRange.end ?? ''}
                onChange={e => { setDateRange(filters.dateRange.start, e.target.value || null); setPage(0); }}
                className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm text-ivory focus:outline-none focus:border-amber/50"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => { resetFilters(); setPage(0); }}
                className="flex items-center gap-2 text-sm text-amber hover:text-amber-muted font-semibold transition-colors cursor-pointer"
              >
                <RotateCcw size={15} />
                <span>Reset all active filters</span>
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Results meta */}
      <div className="flex items-center justify-between text-sm sm:text-base text-ivory-muted pt-1">
        <span className="font-medium">
          {filtered.length === activities.length
            ? `Displaying all ${filtered.length.toLocaleString()} activities`
            : `${filtered.length.toLocaleString()} matching records (${activities.length.toLocaleString()} total)`}
        </span>
        {hasActiveFilters && (
          <button
            onClick={() => { resetFilters(); setPage(0); }}
            className="text-amber hover:underline font-semibold cursor-pointer text-sm"
          >
            Clear active filters
          </button>
        )}
      </div>

      {/* Full-width Responsive Grid */}
      {pageItems.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
            {pageItems.map(activity => (
              <ReceiptCard
                key={activity.id}
                activity={activity}
                isSelected={selectedActivityId === activity.id}
                hasConnections={connectionIndex.has(activity.id)}
                onClick={() => onSelectActivity(activity.id)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 sm:gap-6 pt-8 sm:pt-12">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-3 sm:p-3.5 border border-border rounded-xl text-ivory-muted hover:text-ivory hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                aria-label="Previous page"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm sm:text-base text-ivory font-mono font-semibold">
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="p-3 sm:p-3.5 border border-border rounded-xl text-ivory-muted hover:text-ivory hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                aria-label="Next page"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title="No receipts match your search"
          description="Try broadening your keywords or resetting active category and source filters."
          action={hasActiveFilters ? { label: 'Reset filters', onClick: () => { resetFilters(); setPage(0); } } : undefined}
        />
      )}
    </div>
  );
}
