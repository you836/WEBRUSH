import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Link2, Zap, Calendar, Tag, Type, Layers, ChevronDown, Network } from 'lucide-react';
import { SourceBadge } from '@/components/ui/SourceBadge';
import { EchoText } from '@/components/ui/EchoText';
import { getConnectionReasonLabel } from '@/lib/connections';
import { truncate, formatDate } from '@/lib/formatting';
import type { LifeActivity, Connection, ConnectionReason } from '@/types';

const REASON_ICONS: Record<ConnectionReason, typeof Link2> = {
  'temporal-proximity': Zap,
  'shared-date': Calendar,
  'shared-category': Tag,
  'repeated-keyword': Type,
  'activity-cluster': Layers,
};

interface ConnectionExplorerProps {
  connections: Connection[];
  activities: LifeActivity[];
}

export function ConnectionExplorer({ connections, activities }: ConnectionExplorerProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const activityMap = useMemo(() => {
    const map = new Map<string, LifeActivity>();
    for (const a of activities) map.set(a.id, a);
    return map;
  }, [activities]);

  const reasonCounts = useMemo(() => {
    const counts = new Map<ConnectionReason, number>();
    for (const c of connections) {
      counts.set(c.reason, (counts.get(c.reason) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [connections]);

  const topConnections = connections.slice(0, 18);

  return (
    <div className="space-y-8 sm:space-y-12 w-full">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Network size={18} className="text-amber" />
          <span className="text-sm font-semibold text-amber uppercase tracking-widest">Heuristic Inference Engine</span>
        </div>

        <div className="mb-3">
          <EchoText
            text="Connection Engine"
            fontSize="clamp(2.5rem, 6vw, 4rem)"
            fontWeight={700}
            color="#f5f0e8"
            tint="#e8a849"
            direction="diagonal"
            echoes={8}
            offset={18}
            className="font-serif tracking-tight"
          />
        </div>

        <p className="text-sm sm:text-base md:text-lg text-ivory-muted max-w-3xl leading-relaxed">
          Deterministic relationship discovery across {connections.length} identified multi-modal connections.
        </p>
        <p className="text-xs sm:text-sm text-ivory-muted/70 mt-1.5 font-mono">
          * Heuristic cross-source patterns are exploratory and indicate co-occurrence rather than direct causality.
        </p>
      </motion.div>

      {/* Reason type summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {reasonCounts.map(([reason, count]) => {
          const Icon = REASON_ICONS[reason];
          return (
            <div
              key={reason}
              className="flex items-center justify-between gap-3 px-4 py-3 sm:py-3.5 bg-charcoal/90 border border-border/80 rounded-xl shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <Icon size={18} className="text-amber shrink-0" />
                <span className="text-xs sm:text-sm md:text-base text-ivory font-semibold truncate">{getConnectionReasonLabel(reason)}</span>
              </div>
              <span className="text-xs sm:text-sm text-ivory font-mono bg-surface px-2.5 py-1 rounded-md font-bold shrink-0">{count}</span>
            </div>
          );
        })}
      </div>

      {/* Strongest connections list - 2 column layout on large screens */}
      <div>
        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-ivory mb-4 sm:mb-6">
          Prominent Discovered Relationships ({topConnections.length})
        </h3>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {topConnections.map((conn, idx) => {
            const Icon = REASON_ICONS[conn.reason];
            const isExpanded = expandedId === conn.id;
            const relatedActivities = conn.activities
              .map(id => activityMap.get(id))
              .filter((a): a is LifeActivity => a != null);

            return (
              <motion.div
                key={conn.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(idx * 0.03, 0.3) }}
                className={`bg-charcoal/90 backdrop-blur-md border rounded-2xl overflow-hidden transition-all shadow-md ${
                  isExpanded ? 'border-amber/60 bg-surface/40 shadow-xl ring-1 ring-amber/30' : 'border-border/80 hover:border-border-light hover:shadow-lg'
                }`}
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : conn.id)}
                  className="w-full text-left p-5 sm:p-6 flex items-start gap-4 cursor-pointer select-none"
                  aria-expanded={isExpanded}
                >
                  <div className="p-3 rounded-xl bg-surface/80 mt-0.5 shrink-0 text-amber shadow-inner">
                    <Icon size={20} />
                  </div>

                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex flex-wrap items-center gap-2.5 mb-2">
                      <span className="text-xs sm:text-sm font-bold text-amber tracking-wide uppercase">
                        {getConnectionReasonLabel(conn.reason)}
                      </span>
                      <span className="text-xs font-mono text-ivory bg-surface px-2 py-0.5 rounded-md border border-border/40 font-semibold">
                        {Math.round(conn.strength * 100)}% Match
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-ivory leading-relaxed font-medium">
                      {conn.explanation}
                    </p>
                  </div>

                  <div className="shrink-0 pt-1 text-ivory-muted">
                    <ChevronDown
                      size={20}
                      className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180 text-amber' : ''}`}
                    />
                  </div>
                </button>

                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-border/70 p-5 sm:p-6 space-y-4 bg-midnight/40"
                  >
                    {/* Diagnostic signals */}
                    {conn.signals.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-wider font-semibold text-ivory-muted font-mono">Correlated Evidence Signals</p>
                        <ul className="space-y-1.5">
                          {conn.signals.map((signal, i) => (
                            <li key={i} className="text-xs sm:text-sm text-ivory flex items-start gap-2.5">
                              <span className="text-amber mt-1">•</span>
                              <span>{signal}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Related activities */}
                    <div className="space-y-2 pt-2">
                      <p className="text-xs uppercase tracking-wider font-semibold text-ivory-muted font-mono">Evidence Records in Cluster</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {relatedActivities.map(act => (
                          <div
                            key={act.id}
                            className="flex items-center gap-2.5 p-3 rounded-xl bg-surface border border-border/50 text-xs sm:text-sm"
                          >
                            <SourceBadge source={act.source} size="sm" />
                            <span className="flex-1 text-ivory truncate font-medium">{act.title}</span>
                            <span className="text-xs text-ivory-muted shrink-0 font-mono">{formatDate(act.timestamp)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
