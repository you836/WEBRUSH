import { useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Link2, ArrowRight, Activity } from 'lucide-react';
import { SourceBadge } from '@/components/ui/SourceBadge';
import { formatDate } from '@/lib/formatting';
import { getConnectionsForActivity, getConnectionReasonLabel } from '@/lib/connections';
import type { LifeActivity, Connection } from '@/types';

interface ConnectionPanelProps {
  activity: LifeActivity;
  connections: Connection[];
  allActivities: LifeActivity[];
  onSelectActivity: (id: string) => void;
  onClose: () => void;
}

export function ConnectionPanel({ activity, connections, allActivities, onSelectActivity, onClose }: ConnectionPanelProps) {
  const relatedConnections = getConnectionsForActivity(activity.id, connections);
  const activityMap = new Map(allActivities.map(a => [a.id, a]));

  // Lock body scroll on small screens when panel is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (window.innerWidth < 640) {
      document.body.style.overflow = 'hidden';
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <>
      {/* Backdrop overlay for mobile & tablet */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-midnight/80 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Slide-in drawer - Expanded width and typography */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="fixed top-0 right-0 bottom-0 w-full sm:w-[520px] md:w-[580px] lg:w-[640px] bg-charcoal border-l border-border/80 z-50 overflow-y-auto shadow-2xl flex flex-col"
        role="dialog"
        aria-label="Connection Details Drawer"
        aria-modal="true"
      >
        {/* Sticky Header */}
        <div className="sticky top-0 bg-charcoal/95 backdrop-blur-md border-b border-border p-5 sm:p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <Link2 size={22} className="text-amber" />
            <h3 className="font-serif text-xl sm:text-2xl text-ivory font-bold">Relationship Inspector</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 text-ivory-muted hover:text-ivory rounded-xl hover:bg-surface active:scale-95 transition-all cursor-pointer"
            aria-label="Close connection panel"
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-7 space-y-6 flex-1">
          {/* Selected Record Spotlight */}
          <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 space-y-3.5 shadow-md">
            <div className="flex items-center justify-between">
              <SourceBadge source={activity.source} size="md" />
              <span className="text-xs sm:text-sm text-ivory-muted font-mono font-medium">{formatDate(activity.timestamp)}</span>
            </div>
            <h4 className="text-base sm:text-lg lg:text-xl font-bold text-ivory leading-snug">
              {activity.title}
            </h4>
            {activity.description && (
              <p className="text-sm sm:text-base text-ivory-muted leading-relaxed">
                {activity.description}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {activity.category && (
                <span className="text-xs sm:text-sm px-3 py-1 rounded-lg bg-surface-light text-ivory-muted font-medium border border-border/40">
                  {activity.category}
                </span>
              )}
              {activity.location && (
                <span className="text-xs sm:text-sm text-ivory-muted bg-surface-light px-3 py-1 rounded-lg border border-border/40 truncate max-w-[220px]">
                  📍 {activity.location}
                </span>
              )}
            </div>
          </div>

          {/* Connections List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm sm:text-base font-bold text-ivory flex items-center gap-2">
                <span>Discovered Relationships</span>
                <span className="text-sm text-amber font-mono font-bold">({relatedConnections.length})</span>
              </p>
              <span className="text-xs text-ivory-muted/70 font-mono">Deterministic Signals</span>
            </div>

            {relatedConnections.length > 0 ? (
              <div className="space-y-4">
                {relatedConnections.map(conn => (
                  <div key={conn.id} className="bg-surface border border-border/80 rounded-2xl p-5 space-y-3.5 shadow-md">
                    {/* Reason badge & strength */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity size={16} className="text-amber" />
                        <span className="text-xs sm:text-sm font-bold text-amber tracking-wide uppercase">
                          {getConnectionReasonLabel(conn.reason)}
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm font-mono text-ivory bg-midnight px-2.5 py-0.5 rounded-md border border-border/40 font-semibold">
                        {Math.round(conn.strength * 100)}% match
                      </span>
                    </div>

                    {/* Strength visual meter */}
                    <div className="h-2 bg-surface-light rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber rounded-full transition-all duration-500 shadow-xs"
                        style={{ width: `${conn.strength * 100}%` }}
                      />
                    </div>

                    {/* Grounded explanation */}
                    <p className="text-xs sm:text-sm text-ivory leading-relaxed font-medium">
                      {conn.explanation}
                    </p>

                    {/* Diagnostic signals */}
                    {conn.signals.length > 0 && (
                      <div className="bg-midnight/60 rounded-xl p-3.5 space-y-1.5 border border-border/40">
                        <p className="text-xs uppercase tracking-wider text-ivory-muted font-bold font-mono">Supporting Signals</p>
                        <ul className="space-y-1">
                          {conn.signals.map((signal, i) => (
                            <li key={i} className="text-xs sm:text-sm text-ivory-muted flex items-start gap-2">
                              <span className="text-amber mt-0.5">•</span>
                              <span>{signal}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Related activities */}
                    <div className="space-y-2 pt-1">
                      <p className="text-xs uppercase tracking-wider text-ivory-muted font-bold font-mono">Linked Records</p>
                      {conn.activities
                        .filter(id => id !== activity.id)
                        .map(id => {
                          const related = activityMap.get(id);
                          if (!related) return null;
                          return (
                            <button
                              key={id}
                              onClick={() => onSelectActivity(id)}
                              className="w-full text-left flex items-center gap-3 p-3 rounded-xl bg-midnight/70 hover:bg-midnight border border-border/40 hover:border-amber/50 text-xs sm:text-sm transition-all group active:scale-98 cursor-pointer"
                            >
                              <SourceBadge source={related.source} size="sm" />
                              <span className="flex-1 text-ivory truncate font-medium">{related.title}</span>
                              <ArrowRight size={15} className="text-ivory-muted group-hover:text-amber transition-colors shrink-0" />
                            </button>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 px-6 bg-surface/30 border border-dashed border-border rounded-2xl">
                <Link2 size={28} className="text-ivory-muted/30 mx-auto mb-3" />
                <p className="text-base font-medium text-ivory">No cross-record link identified</p>
                <p className="text-xs sm:text-sm text-ivory-muted/70 mt-1 max-w-xs mx-auto">
                  This record does not meet temporal proximity or shared-attribute clustering thresholds.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer info notice */}
        <div className="p-4 border-t border-border bg-charcoal text-xs text-ivory-muted/70 text-center font-mono">
          Heuristic relationship inference • No personal identity assumed
        </div>
      </motion.div>
    </>
  );
}
