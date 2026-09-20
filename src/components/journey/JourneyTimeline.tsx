import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { EchoText } from '@/components/ui/EchoText';
import { formatShortMonth } from '@/lib/formatting';
import type { LifeActivity, LifeSource } from '@/types';

const SOURCE_COLORS: Record<LifeSource, { color: string; gradient: string }> = {
  music: { color: '#a78bfa', gradient: 'from-purple-500 to-indigo-400' },
  banking: { color: '#5b8af5', gradient: 'from-blue-600 to-cyan-400' },
  household: { color: '#e8a849', gradient: 'from-amber-600 to-yellow-400' },
};

interface JourneyTimelineProps {
  activities: LifeActivity[];
  onSelectMonth: (month: string) => void;
}

export function JourneyTimeline({ activities, onSelectMonth }: JourneyTimelineProps) {
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);
  const [showDetailedTimeline, setShowDetailedTimeline] = useState(false);
  const [showAllMonths, setShowAllMonths] = useState(false);

  const monthlyData = useMemo(() => {
    const months = new Map<string, { music: number; banking: number; household: number; total: number }>();

    for (const act of activities) {
      const month = act.timestamp.slice(0, 7);
      if (!months.has(month)) {
        months.set(month, { music: 0, banking: 0, household: 0, total: 0 });
      }
      const entry = months.get(month)!;
      entry[act.source]++;
      entry.total++;
    }

    return [...months.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, counts]) => ({ month, ...counts }));
  }, [activities]);

  const maxTotal = Math.max(...monthlyData.map(m => m.total), 1);
  const PREVIEW_LIMIT = 5;
  const visibleMonthlyData = showAllMonths ? monthlyData : monthlyData.slice(0, PREVIEW_LIMIT);
  const remainingCount = monthlyData.length - PREVIEW_LIMIT;

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
            <Compass size={18} className="text-amber" />
            <span className="text-sm font-semibold text-amber uppercase tracking-widest">Chronological Footprint</span>
          </div>
          <div className="mb-3">
            <EchoText
              text="Interactive Journey"
              fontSize="clamp(2.5rem, 6vw, 4.5rem)"
              fontWeight={700}
              color="#f5f0e8"
              tint="#5b8af5"
              direction="diagonal"
              echoes={8}
              offset={18}
              className="font-serif tracking-tight"
            />
          </div>
          <p className="text-sm sm:text-base md:text-lg text-ivory-muted mt-2 max-w-3xl leading-relaxed">
            Explore the temporal ebb and flow of digital life footprints across all observed timeline months.
          </p>
        </div>

        <button
          onClick={() => setShowDetailedTimeline(!showDetailedTimeline)}
          className="px-5 py-3 rounded-xl bg-surface border border-border/80 text-xs sm:text-sm font-semibold text-amber hover:border-amber/50 hover:bg-surface-light transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto shadow-sm"
        >
          <span>{showDetailedTimeline ? 'Hide Granular Statistics' : 'View Granular Monthly Table'}</span>
          {showDetailedTimeline ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </motion.div>

      {/* Timeline visualization */}
      <div className="bg-charcoal/90 backdrop-blur-md border border-border/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden w-full">
        {/* Glow */}
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-amber/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between text-xs sm:text-sm text-ivory-muted pb-3 border-b border-border/40 font-mono font-semibold">
          <span>PERIOD ({monthlyData.length} MONTHS OBSERVED)</span>
          <span className="hidden sm:inline">CROSS-CHANNEL COMPOSITION & ACTIVITY DENSITY</span>
          <span>VOLUME</span>
        </div>

        {/* Timeline rows */}
        <div className="space-y-3">
          <AnimatePresence>
            {visibleMonthlyData.map((data, idx) => {
              const totalWidth = Math.max((data.total / maxTotal) * 100, 6);
              const musicPct = data.total > 0 ? (data.music / data.total) * 100 : 0;
              const bankingPct = data.total > 0 ? (data.banking / data.total) * 100 : 0;
              const householdPct = data.total > 0 ? (data.household / data.total) * 100 : 0;
              const isHighlight = data.total >= maxTotal * 0.75;
              const isHovered = hoveredMonth === data.month;

              return (
                <motion.button
                  key={data.month}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, delay: Math.min(idx * 0.02, 0.2) }}
                  onClick={() => onSelectMonth(data.month)}
                  onMouseEnter={() => setHoveredMonth(data.month)}
                  onMouseLeave={() => setHoveredMonth(null)}
                  className={`w-full flex items-center gap-3 sm:gap-6 py-3 px-3 sm:px-5 rounded-xl transition-all cursor-pointer text-left border ${
                    isHovered
                      ? 'bg-surface-light border-amber/50 shadow-lg scale-[1.008]'
                      : 'border-transparent hover:bg-surface/50'
                  }`}
                  aria-label={`View records for ${formatShortMonth(data.month)} (${data.total} activities)`}
                >
                  <div className="w-16 sm:w-24 shrink-0">
                    <span
                      className={`text-sm sm:text-base font-mono font-bold block ${
                        isHighlight ? 'text-amber' : 'text-ivory'
                      }`}
                    >
                      {formatShortMonth(data.month)}
                    </span>
                    {isHighlight && (
                      <span className="hidden sm:inline-block text-[10px] text-amber/90 font-mono tracking-wider uppercase font-semibold">
                        Peak Era
                      </span>
                    )}
                  </div>

                  <div className="flex-1 h-7 sm:h-8 bg-midnight/90 rounded-xl overflow-hidden p-1 border border-border/50 shadow-inner">
                    <div
                      className="h-full flex rounded-lg overflow-hidden transition-all duration-700"
                      style={{ width: `${totalWidth}%` }}
                    >
                      {data.music > 0 && (
                        <div
                          className={`h-full bg-gradient-to-r ${SOURCE_COLORS.music.gradient}`}
                          style={{ width: `${musicPct}%` }}
                          title={`Music: ${data.music}`}
                        />
                      )}
                      {data.banking > 0 && (
                        <div
                          className={`h-full bg-gradient-to-r ${SOURCE_COLORS.banking.gradient}`}
                          style={{ width: `${bankingPct}%` }}
                          title={`Banking: ${data.banking}`}
                        />
                      )}
                      {data.household > 0 && (
                        <div
                          className={`h-full bg-gradient-to-r ${SOURCE_COLORS.household.gradient}`}
                          style={{ width: `${householdPct}%` }}
                          title={`Household: ${data.household}`}
                        />
                      )}
                    </div>
                  </div>

                  <span className="w-12 sm:w-16 text-sm sm:text-base font-mono font-bold text-ivory text-right tabular-nums shrink-0">
                    {data.total}
                  </span>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {/* View More / View Less Toggle Button for Months */}
        {monthlyData.length > PREVIEW_LIMIT && (
          <div className="flex justify-center pt-2 pb-1">
            <button
              onClick={() => setShowAllMonths(!showAllMonths)}
              className="px-6 py-2.5 rounded-xl bg-surface-light/80 hover:bg-surface-light border border-border hover:border-amber/60 text-xs sm:text-sm font-semibold text-ivory hover:text-amber transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <span>
                {showAllMonths
                  ? 'Show Fewer Months'
                  : `View More Months (${remainingCount} more)`}
              </span>
              {showAllMonths ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        )}

        {/* Legend & Actionable Hint */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-5 border-t border-border/50 text-sm">
          <div className="flex flex-wrap gap-4 sm:gap-6">
            {(['music', 'banking', 'household'] as LifeSource[]).map(src => (
              <span key={src} className="flex items-center gap-2 text-xs sm:text-sm text-ivory-muted font-semibold">
                <span
                  className="w-3 h-3 rounded-full shadow-xs"
                  style={{ backgroundColor: SOURCE_COLORS[src].color }}
                />
                <span className="capitalize">{src}</span>
              </span>
            ))}
          </div>
          <button
            onClick={() => setShowDetailedTimeline(!showDetailedTimeline)}
            className="text-xs sm:text-sm text-amber font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{showDetailedTimeline ? 'Collapse Statistics' : 'View More Statistics & Percentages'}</span>
            {showDetailedTimeline ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Expandable Granular Monthly Statistics Panel */}
        <AnimatePresence>
          {showDetailedTimeline && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-4 border-t border-border/40 space-y-4"
            >
              <h4 className="text-sm sm:text-base font-semibold text-ivory flex items-center gap-2">
                <Sparkles size={16} className="text-amber" />
                <span>Granular Monthly Channel Composition Matrix</span>
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm font-mono">
                  <thead>
                    <tr className="border-b border-border/40 text-ivory-muted uppercase text-[11px]">
                      <th className="py-2.5 px-3">Month</th>
                      <th className="py-2.5 px-3 text-music">Music (%)</th>
                      <th className="py-2.5 px-3 text-banking">Banking (%)</th>
                      <th className="py-2.5 px-3 text-household">Household (%)</th>
                      <th className="py-2.5 px-3 text-right text-ivory">Total Count</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {monthlyData.map((d) => (
                      <tr key={d.month} className="hover:bg-surface/50">
                        <td className="py-2.5 px-3 font-sans font-semibold text-ivory">{formatShortMonth(d.month)}</td>
                        <td className="py-2.5 px-3 text-music">{d.music} ({Math.round((d.music / d.total) * 100 || 0)}%)</td>
                        <td className="py-2.5 px-3 text-banking">{d.banking} ({Math.round((d.banking / d.total) * 100 || 0)}%)</td>
                        <td className="py-2.5 px-3 text-household">{d.household} ({Math.round((d.household / d.total) * 100 || 0)}%)</td>
                        <td className="py-2.5 px-3 text-right font-bold text-ivory">{d.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Month Snapshot Tooltip */}
        <AnimatePresence>
          {hoveredMonth && !showDetailedTimeline && (() => {
            const data = monthlyData.find(m => m.month === hoveredMonth);
            if (!data) return null;
            return (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="p-4 bg-surface/95 border border-border/80 rounded-xl text-sm text-ivory-muted flex flex-wrap items-center justify-between gap-3 shadow-2xl"
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-amber" />
                  <span className="font-bold text-ivory text-base">{formatShortMonth(data.month)} Snapshot:</span>
                </div>
                <div className="flex items-center gap-4 font-mono text-xs sm:text-sm">
                  {data.music > 0 && <span className="text-music font-semibold">{data.music} music</span>}
                  {data.banking > 0 && <span className="text-banking font-semibold">{data.banking} bank txns</span>}
                  {data.household > 0 && <span className="text-household font-semibold">{data.household} household</span>}
                </div>
                <span className="font-bold text-amber font-mono text-base">{data.total} total</span>
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </div>
    </div>
  );
}
