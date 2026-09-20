import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BarChart3,
  Music,
  CreditCard,
  TrendingUp,
  Clock,
  Layers,
  Sparkles,
  AreaChart as AreaChartIcon,
  BarChart2,
  PieChart as PieIcon,
  ChevronDown,
  ChevronUp,
  X,
  Database,
  ExternalLink,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from 'recharts';
import { StatCard } from '@/components/ui/StatCard';
import { BorderGlow } from '@/components/ui/BorderGlow';
import { formatCurrency, formatMonth } from '@/lib/formatting';
import type { DataStats, LifeActivity, LifeSource } from '@/types';

const SOURCE_COLORS: Record<LifeSource, { base: string; gradient: string; glow: string }> = {
  music: { base: '#a78bfa', gradient: 'url(#musicGrad)', glow: 'rgba(167, 139, 250, 0.4)' },
  banking: { base: '#5b8af5', gradient: 'url(#bankingGrad)', glow: 'rgba(91, 138, 245, 0.4)' },
  household: { base: '#e8a849', gradient: 'url(#householdGrad)', glow: 'rgba(232, 168, 73, 0.4)' },
};

interface InsightDashboardProps {
  stats: DataStats;
  activities: LifeActivity[];
}

// Custom Glass Tooltip
const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  const total = payload.reduce((acc: number, curr: any) => acc + (Number(curr.value) || 0), 0);

  return (
    <div className="bg-charcoal/95 backdrop-blur-md border border-border/80 rounded-xl p-4 shadow-2xl space-y-2.5 min-w-[200px] text-sm">
      <div className="flex items-center justify-between pb-2 border-b border-border/50">
        <span className="font-serif font-semibold text-ivory text-base">{label}</span>
        <span className="text-xs font-mono text-ivory-muted">{total} total</span>
      </div>
      <div className="space-y-2">
        {payload.map((entry: any, i: number) => {
          const color = entry.color || entry.fill || '#e8a849';
          return (
            <div key={i} className="flex items-center justify-between gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-ivory-muted capitalize font-medium">{entry.name}</span>
              </div>
              <span className="font-mono font-semibold text-ivory">{entry.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export function InsightDashboard({ stats }: InsightDashboardProps) {
  const [chartMode, setChartMode] = useState<'area' | 'bar'>('area');
  const [categoryView, setCategoryView] = useState<'chart' | 'bars'>('chart');
  
  // "View More" states for end graphs & lists
  const [showAllArtists, setShowAllArtists] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showDataAuditModal, setShowDataAuditModal] = useState(false);
  const [showMonthlyBreakdownModal, setShowMonthlyBreakdownModal] = useState(false);

  // Aggregate monthly data for stacked chart & stream
  const monthlyData = (() => {
    const months = new Map<string, Record<LifeSource, number>>();
    for (const entry of stats.monthlyDistribution) {
      if (!months.has(entry.month)) {
        months.set(entry.month, { music: 0, banking: 0, household: 0 });
      }
      months.get(entry.month)![entry.source] += entry.count;
    }
    return [...months.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, counts]) => ({
        month: formatMonth(month),
        shortMonth: month.slice(5),
        ...counts,
        total: counts.music + counts.banking + counts.household,
      }));
  })();

  // Top categories for ranking & chart (all vs slice)
  const displayedCategories = (showAllCategories ? stats.topCategories : stats.topCategories.slice(0, 8)).map(c => ({
    name: c.name.length > 14 ? c.name.slice(0, 14) + '…' : c.name,
    fullName: c.name,
    count: c.count,
    percentage: Math.round((c.count / stats.totalActivities) * 100),
  }));

  const maxCategoryCount = Math.max(...displayedCategories.map(c => c.count), 1);

  // Top Artists list (all vs slice)
  const displayedArtists = showAllArtists ? stats.topArtists : stats.topArtists.slice(0, 6);

  return (
    <div className="space-y-8 sm:space-y-12 w-full">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={18} className="text-amber" />
            <span className="text-sm font-semibold text-amber uppercase tracking-widest">Digital Museum Insights</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-ivory tracking-tight">
            Insight Overview
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-ivory-muted mt-2 max-w-3xl leading-relaxed">
            Analytical synthesis derived across {stats.totalActivities.toLocaleString()} multi-modal digital activities.
          </p>
        </div>

        {/* Action button to open full data audit */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMonthlyBreakdownModal(true)}
            className="px-4 py-2.5 rounded-xl bg-surface border border-border/80 text-xs sm:text-sm font-semibold text-ivory hover:border-amber/50 hover:bg-surface-light transition-all flex items-center gap-2 cursor-pointer"
          >
            <Clock size={16} className="text-amber" />
            <span>Monthly Data Table</span>
          </button>
          <button
            onClick={() => setShowDataAuditModal(true)}
            className="px-4 py-2.5 rounded-xl bg-surface border border-border/80 text-xs sm:text-sm font-semibold text-ivory hover:border-amber/50 hover:bg-surface-light transition-all flex items-center gap-2 cursor-pointer"
          >
            <Database size={16} className="text-blue" />
            <span>Dataset Provenance Audit</span>
          </button>
        </div>
      </motion.div>

      {/* Top stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <StatCard
          value={stats.totalActivities.toLocaleString()}
          label="Total Activities"
          icon={<BarChart3 size={22} className="text-amber" />}
          sublabel="Cross-source records"
        />
        <StatCard
          value={stats.sources.music.toLocaleString()}
          label="Tracks Streamed"
          icon={<Music size={22} className="text-music" />}
          source="music"
          sublabel={`~${stats.avgListeningMinutes.toFixed(1)} min avg playback`}
        />
        <StatCard
          value={formatCurrency(stats.totalSpending)}
          label="Total Outflow"
          icon={<CreditCard size={22} className="text-banking" />}
          sublabel="Debits & Expenses"
        />
        <StatCard
          value={formatCurrency(stats.totalIncome)}
          label="Total Inflow"
          icon={<TrendingUp size={22} className="text-emerald-400" />}
          sublabel="Credits & Deposits"
        />
      </div>

      {/* Modern Redesigned Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Main Monthly Activity Flow with BorderGlow */}
        <BorderGlow
          glowColor="40 85 80"
          colors={['#e8a849', '#f59e0b', '#d97706']}
          borderRadius={20}
          className="h-full"
        >
          <div className="bg-charcoal/90 backdrop-blur-md p-6 sm:p-8 flex flex-col justify-between h-full relative overflow-hidden group">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base sm:text-xl font-semibold text-ivory flex items-center gap-2.5">
                  <Clock size={18} className="text-amber" />
                  Chronological Density Flow
                </h3>
                <p className="text-xs sm:text-sm text-ivory-muted/70 mt-1">Continuous volume timeline across active months</p>
              </div>

              {/* Mode Switcher & View More Table Trigger */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-surface-light p-1.5 rounded-xl border border-border/50">
                  <button
                    onClick={() => setChartMode('area')}
                    className={`p-2 rounded-lg transition-all cursor-pointer ${
                      chartMode === 'area'
                        ? 'bg-amber text-midnight shadow-md font-bold'
                        : 'text-ivory-muted hover:text-ivory'
                    }`}
                    title="Spline Area View"
                    aria-label="Area Chart View"
                  >
                    <AreaChartIcon size={16} />
                  </button>
                  <button
                    onClick={() => setChartMode('bar')}
                    className={`p-2 rounded-lg transition-all cursor-pointer ${
                      chartMode === 'bar'
                        ? 'bg-amber text-midnight shadow-md font-bold'
                        : 'text-ivory-muted hover:text-ivory'
                    }`}
                    title="Stacked Column View"
                    aria-label="Bar Chart View"
                  >
                    <BarChart2 size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Chart Canvas */}
            <div className="h-72 sm:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartMode === 'area' ? (
                  <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="musicGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.55} />
                        <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="bankingGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#5b8af5" stopOpacity={0.55} />
                        <stop offset="95%" stopColor="#5b8af5" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="householdGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#e8a849" stopOpacity={0.55} />
                        <stop offset="95%" stopColor="#e8a849" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#242430" strokeDasharray="3 3" vertical={false} opacity={0.6} />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: '#c8c0b4', fontSize: 11, fontFamily: 'monospace' }}
                      axisLine={{ stroke: '#2a2a35' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#c8c0b4', fontSize: 11, fontFamily: 'monospace' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="household"
                      name="Household"
                      stackId="1"
                      stroke="#e8a849"
                      strokeWidth={2.5}
                      fill="url(#householdGrad)"
                    />
                    <Area
                      type="monotone"
                      dataKey="banking"
                      name="Banking"
                      stackId="1"
                      stroke="#5b8af5"
                      strokeWidth={2.5}
                      fill="url(#bankingGrad)"
                    />
                    <Area
                      type="monotone"
                      dataKey="music"
                      name="Music"
                      stackId="1"
                      stroke="#a78bfa"
                      strokeWidth={2.5}
                      fill="url(#musicGrad)"
                    />
                  </AreaChart>
                ) : (
                  <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="musicBarGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#c4b5fd" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                      <linearGradient id="bankingBarGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#93c5fd" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                      <linearGradient id="householdBarGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fcd34d" />
                        <stop offset="100%" stopColor="#d97706" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#242430" strokeDasharray="3 3" vertical={false} opacity={0.6} />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: '#c8c0b4', fontSize: 11, fontFamily: 'monospace' }}
                      axisLine={{ stroke: '#2a2a35' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#c8c0b4', fontSize: 11, fontFamily: 'monospace' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Bar dataKey="household" name="Household" stackId="a" fill="url(#householdBarGrad)" />
                    <Bar dataKey="banking" name="Banking" stackId="a" fill="url(#bankingBarGrad)" />
                    <Bar dataKey="music" name="Music" stackId="a" fill="url(#musicBarGrad)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Styled Legend & View More Trigger */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-border/50 text-sm">
              <div className="flex items-center gap-4 sm:gap-6">
                {(['music', 'banking', 'household'] as LifeSource[]).map(src => (
                  <span key={src} className="flex items-center gap-2 text-xs sm:text-sm text-ivory-muted font-medium">
                    <span
                      className="w-3 h-3 rounded-full shadow-xs"
                      style={{ backgroundColor: SOURCE_COLORS[src].base }}
                    />
                    <span className="capitalize">{src}</span>
                  </span>
                ))}
              </div>
              <button
                onClick={() => setShowMonthlyBreakdownModal(true)}
                className="text-xs text-amber hover:text-amber-muted font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>View Full Monthly Breakdown</span>
                <ExternalLink size={12} />
              </button>
            </div>
          </div>
        </BorderGlow>


        {/* Category Taxonomy & Distribution with BorderGlow */}
        <BorderGlow
          glowColor="215 90 75"
          colors={['#5b8af5', '#3b82f6', '#93c5fd']}
          borderRadius={20}
          className="h-full"
        >
          <div className="bg-charcoal/90 backdrop-blur-md p-6 sm:p-8 flex flex-col justify-between h-full relative overflow-hidden">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base sm:text-xl font-semibold text-ivory flex items-center gap-2.5">
                  <Layers size={18} className="text-blue" />
                  Category Spectrum & Distribution
                </h3>
                <p className="text-xs sm:text-sm text-ivory-muted/70 mt-1">Top recurring themes & spend avenues</p>
              </div>

              <div className="flex items-center gap-1.5 bg-surface-light p-1.5 rounded-xl border border-border/50">
                <button
                  onClick={() => setCategoryView('chart')}
                  className={`p-2 rounded-lg transition-all cursor-pointer ${
                    categoryView === 'chart'
                      ? 'bg-blue text-white shadow-md font-bold'
                      : 'text-ivory-muted hover:text-ivory'
                  }`}
                  title="Bar Ranking"
                  aria-label="Bar Ranking"
                >
                  <BarChart2 size={16} />
                </button>
                <button
                  onClick={() => setCategoryView('bars')}
                  className={`p-2 rounded-lg transition-all cursor-pointer ${
                    categoryView === 'bars'
                      ? 'bg-blue text-white shadow-md font-bold'
                      : 'text-ivory-muted hover:text-ivory'
                  }`}
                  title="Detailed Spectrum"
                  aria-label="Spectrum Progress Bars"
                >
                  <PieIcon size={16} />
                </button>
              </div>
            </div>

            {/* Category Visual with Expandable Height */}
            <div className={`${showAllCategories ? 'h-96' : 'h-72 sm:h-80'} w-full flex items-center transition-all duration-300`}>
              {categoryView === 'chart' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={displayedCategories}
                    layout="vertical"
                    margin={{ top: 5, right: 25, left: 15, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="catBarGradAmber" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#d97706" />
                        <stop offset="100%" stopColor="#fcd34d" />
                      </linearGradient>
                      <linearGradient id="catBarGradBlue" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#2563eb" />
                        <stop offset="100%" stopColor="#60a5fa" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#242430" strokeDasharray="3 3" horizontal={false} opacity={0.5} />
                    <XAxis
                      type="number"
                      tick={{ fill: '#c8c0b4', fontSize: 11, fontFamily: 'monospace' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fill: '#f5f0e8', fontSize: 11, fontWeight: 500 }}
                      axisLine={false}
                      tickLine={false}
                      width={95}
                    />
                    <Tooltip
                      formatter={(value: any, name: any, item: any) => [
                        `${value} records (${item?.payload?.percentage}%)`,
                        item?.payload?.fullName || name,
                      ]}
                      contentStyle={{
                        backgroundColor: '#1a1a22',
                        border: '1px solid #3a3a48',
                        borderRadius: '12px',
                        color: '#f5f0e8',
                        fontSize: '13px',
                        padding: '12px',
                      }}
                    />
                    <Bar dataKey="count" name="Frequency" radius={[0, 8, 8, 0]}>
                      {displayedCategories.map((_, idx) => (
                        <Cell
                          key={idx}
                          fill={idx % 2 === 0 ? 'url(#catBarGradAmber)' : 'url(#catBarGradBlue)'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full space-y-3 overflow-y-auto max-h-88 pr-2">
                  {displayedCategories.map((cat, idx) => {
                    const widthPct = (cat.count / maxCategoryCount) * 100;
                    const isAmber = idx % 2 === 0;
                    return (
                      <div key={cat.fullName} className="space-y-1.5">
                        <div className="flex justify-between text-sm sm:text-base">
                          <span className="text-ivory font-medium truncate">{cat.fullName}</span>
                          <span className="font-mono text-ivory-muted text-xs sm:text-sm shrink-0">
                            {cat.count} records ({cat.percentage}%)
                          </span>
                        </div>
                        <div className="h-2.5 bg-surface rounded-full overflow-hidden p-0.5 border border-border/40">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${widthPct}%` }}
                            transition={{ duration: 0.6, delay: idx * 0.03 }}
                            className={`h-full rounded-full ${
                              isAmber
                                ? 'bg-gradient-to-r from-amber-600 to-amber-400'
                                : 'bg-gradient-to-r from-blue-600 to-blue-400'
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer note with View More Toggle */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50 text-xs sm:text-sm text-ivory-muted/70">
              <span>Derived from merchant & playlist meta</span>
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="text-xs sm:text-sm text-blue hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>{showAllCategories ? 'View Less' : `View More (${stats.topCategories.length})`}</span>
                {showAllCategories ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>
            </div>
          </div>
        </BorderGlow>
      </div>


      {/* Top Artists & Bottom Graphs with View More Option */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Top Artists (Card 1 at the end) */}
        <div className="bg-charcoal/90 backdrop-blur-md border border-border rounded-2xl p-6 sm:p-7 md:col-span-2 lg:col-span-1 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-ivory flex items-center gap-2">
                <Music size={18} className="text-music" />
                Featured Artists
              </h3>
              <span className="text-xs font-mono text-music bg-music/15 border border-music/30 px-3 py-1 rounded-full">
                Spotify History
              </span>
            </div>

            <ul className="space-y-2.5">
              {displayedArtists.map((artist, i) => (
                <li
                  key={artist.name}
                  className="flex items-center justify-between text-sm sm:text-base py-2 px-3 rounded-xl hover:bg-surface/60 transition-colors border-b border-border/20 last:border-0"
                >
                  <span className="text-ivory flex items-center gap-3 truncate pr-2 font-medium">
                    <span className="text-ivory-muted/50 w-4 text-right text-xs sm:text-sm font-mono font-bold">
                      {i + 1}
                    </span>
                    <span className="truncate">{artist.name}</span>
                  </span>
                  <span className="text-ivory-muted text-xs sm:text-sm shrink-0 font-mono bg-surface-light px-2.5 py-1 rounded-md">
                    {artist.plays} streams
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* View More Option for Featured Artists */}
          <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-between">
            <span className="text-xs text-ivory-muted/60">Top streamed artists</span>
            {stats.topArtists.length > 6 && (
              <button
                onClick={() => setShowAllArtists(!showAllArtists)}
                className="text-xs sm:text-sm font-semibold text-music hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{showAllArtists ? 'View Less' : `View More (${stats.topArtists.length} Artists)`}</span>
                {showAllArtists ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            )}
          </div>
        </div>

        {/* Source breakdown (Card 2 at the end) */}
        <div className="bg-charcoal/90 backdrop-blur-md border border-border rounded-2xl p-6 sm:p-7 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-ivory mb-4">Multimodal Ingestion</h3>
            <div className="space-y-4">
              {(['music', 'banking', 'household'] as LifeSource[]).map(src => {
                const count = stats.sources[src];
                const pct = stats.totalActivities > 0 ? (count / stats.totalActivities) * 100 : 0;
                return (
                  <div key={src} className="space-y-1.5">
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-ivory capitalize font-semibold">{src}</span>
                      <span className="text-ivory-muted font-mono text-xs sm:text-sm">
                        {count.toLocaleString()} <span className="text-ivory-muted/60">({pct.toFixed(0)}%)</span>
                      </span>
                    </div>
                    <div className="h-2.5 bg-surface rounded-full overflow-hidden p-0.5 border border-border/40">
                      <div
                        className="h-full rounded-full transition-all duration-700 shadow-xs"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: SOURCE_COLORS[src].base,
                          boxShadow: `0 0 10px ${SOURCE_COLORS[src].glow}`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-between">
            <span className="text-xs text-ivory-muted/60">Pillar distribution</span>
            <button
              onClick={() => setShowMonthlyBreakdownModal(true)}
              className="text-xs sm:text-sm font-semibold text-amber hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Data Flow Details</span>
              <ExternalLink size={12} />
            </button>
          </div>
        </div>

        {/* Date range & Dataset Coverage (Card 3 at the end) */}
        <div className="bg-charcoal/90 backdrop-blur-md border border-border rounded-2xl p-6 sm:p-7 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-ivory mb-4">Dataset Provenance</h3>
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-xl bg-surface/60 border border-border/40">
                <p className="text-xs uppercase tracking-wider text-ivory-muted font-mono">Temporal Span</p>
                <p className="text-ivory font-serif text-base sm:text-lg lg:text-xl font-semibold mt-1">
                  {stats.dateRange.earliest.slice(0, 10)} <span className="text-amber">→</span> {stats.dateRange.latest.slice(0, 10)}
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-surface/60 border border-border/40">
                <p className="text-xs uppercase tracking-wider text-ivory-muted font-mono">Unique Taxonomy Nodes</p>
                <p className="text-ivory font-serif text-base sm:text-lg lg:text-xl font-semibold mt-1">
                  {stats.topCategories.length}+ distinct categories
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-between">
            <span className="text-xs text-ivory-muted/60 font-mono">Zero API calls • Local</span>
            <button
              onClick={() => setShowDataAuditModal(true)}
              className="text-xs sm:text-sm font-semibold text-blue hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Full Schema Audit</span>
              <ExternalLink size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal 1: Full Monthly Data Table Breakdown */}
      <AnimatePresence>
        {showMonthlyBreakdownModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMonthlyBreakdownModal(false)}
              className="fixed inset-0 bg-midnight/80 backdrop-blur-md"
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-4xl bg-charcoal border border-border/90 rounded-2xl p-6 sm:p-8 shadow-2xl z-10 max-h-[85vh] overflow-y-auto space-y-6"
              role="dialog"
              aria-modal="true"
            >
              <div className="flex items-center justify-between pb-4 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <Clock size={22} className="text-amber" />
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-ivory">Monthly Activity Breakdown Table</h3>
                    <p className="text-xs sm:text-sm text-ivory-muted">Granular monthly breakdown across all 3 source pillars</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMonthlyBreakdownModal(false)}
                  className="p-2 rounded-lg hover:bg-surface text-ivory-muted hover:text-ivory transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border/60 text-xs font-mono uppercase text-ivory-muted">
                      <th className="py-3 px-3">Month</th>
                      <th className="py-3 px-3 text-music">Music Streams</th>
                      <th className="py-3 px-3 text-banking">Banking Txns</th>
                      <th className="py-3 px-3 text-household">Household Spends</th>
                      <th className="py-3 px-3 text-right font-bold text-ivory">Total Activities</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 font-mono">
                    {monthlyData.map((row) => (
                      <tr key={row.month} className="hover:bg-surface/50 transition-colors">
                        <td className="py-3 px-3 font-sans font-semibold text-ivory">{row.month}</td>
                        <td className="py-3 px-3 text-music">{row.music.toLocaleString()}</td>
                        <td className="py-3 px-3 text-banking">{row.banking.toLocaleString()}</td>
                        <td className="py-3 px-3 text-household">{row.household.toLocaleString()}</td>
                        <td className="py-3 px-3 text-right font-bold text-ivory">{row.total.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-border/80 font-bold text-ivory font-mono">
                      <td className="py-3.5 px-3 font-sans">All Periods</td>
                      <td className="py-3.5 px-3 text-music">{stats.sources.music.toLocaleString()}</td>
                      <td className="py-3.5 px-3 text-banking">{stats.sources.banking.toLocaleString()}</td>
                      <td className="py-3.5 px-3 text-household">{stats.sources.household.toLocaleString()}</td>
                      <td className="py-3.5 px-3 text-right text-amber">{stats.totalActivities.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal 2: Full Dataset Schema & Provenance Audit */}
      <AnimatePresence>
        {showDataAuditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDataAuditModal(false)}
              className="fixed inset-0 bg-midnight/80 backdrop-blur-md"
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-4xl bg-charcoal border border-border/90 rounded-2xl p-6 sm:p-8 shadow-2xl z-10 max-h-[85vh] overflow-y-auto space-y-6"
              role="dialog"
              aria-modal="true"
            >
              <div className="flex items-center justify-between pb-4 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <Database size={22} className="text-blue" />
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-ivory">Dataset Provenance & Integrity Audit</h3>
                    <p className="text-xs sm:text-sm text-ivory-muted">Verification of normalized multi-source dataset ingestion</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDataAuditModal(false)}
                  className="p-2 rounded-lg hover:bg-surface text-ivory-muted hover:text-ivory transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-5 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-surface/70 border border-border/60 p-4 rounded-xl space-y-1.5">
                    <p className="text-xs uppercase font-mono text-music font-bold">1. Spotify Listening History</p>
                    <p className="text-xl font-bold font-mono text-ivory">{stats.sources.music.toLocaleString()} rows</p>
                    <p className="text-xs text-ivory-muted">Extracted from spotify_history.csv with track, artist, album, platform, duration, and skip flags.</p>
                  </div>
                  <div className="bg-surface/70 border border-border/60 p-4 rounded-xl space-y-1.5">
                    <p className="text-xs uppercase font-mono text-banking font-bold">2. India Transactions</p>
                    <p className="text-xl font-bold font-mono text-ivory">{stats.sources.banking.toLocaleString()} rows</p>
                    <p className="text-xs text-ivory-muted">Extracted with merchant cleaning, category normalization, and masked card numbers (•••• 1234).</p>
                  </div>
                  <div className="bg-surface/70 border border-border/60 p-4 rounded-xl space-y-1.5">
                    <p className="text-xs uppercase font-mono text-household font-bold">3. Household Cashbook</p>
                    <p className="text-xl font-bold font-mono text-ivory">{stats.sources.household.toLocaleString()} rows</p>
                    <p className="text-xs text-ivory-muted">Parsed with payment modes (UPI/Cash/Card) and income vs. expense balance calculations.</p>
                  </div>
                </div>

                <div className="bg-midnight/70 rounded-xl p-4 space-y-2 border border-border/50">
                  <h4 className="text-sm font-semibold text-ivory flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    <span>Privacy Safeguards & Schema Normalization</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-ivory-muted/90 list-disc list-inside">
                    <li>Zero personally identifiable information (PII), street addresses, or dates of birth are published or retained.</li>
                    <li>Credit and debit card numbers are strictly masked (`•••• XXXX`) and cannot be reconstructed.</li>
                    <li>Deterministic connection engine operates entirely in-memory on the client; no external AI or analytics telemetry.</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
