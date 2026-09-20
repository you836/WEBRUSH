import { memo } from 'react';
import { motion } from 'motion/react';
import { MapPin, Link2 } from 'lucide-react';
import { SourceBadge } from '@/components/ui/SourceBadge';
import { formatDate, formatCurrency, truncate } from '@/lib/formatting';
import type { LifeActivity } from '@/types';

interface ReceiptCardProps {
  activity: LifeActivity;
  isSelected?: boolean;
  hasConnections?: boolean;
  onClick?: () => void;
}

export const ReceiptCard = memo(function ReceiptCard({ activity, isSelected, hasConnections, onClick }: ReceiptCardProps) {
  return (
    <motion.button
      layout
      onClick={onClick}
      className={`w-full text-left bg-charcoal/90 backdrop-blur-md border rounded-xl p-4 sm:p-5 transition-all cursor-pointer select-none ${
        isSelected
          ? 'border-amber ring-2 ring-amber/50 bg-surface shadow-lg'
          : 'border-border/80 hover:border-border-light hover:bg-surface/60 hover:shadow-md active:bg-surface'
      }`}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.985 }}
    >
      <div className="flex items-center justify-between mb-2.5">
        <SourceBadge source={activity.source} size="md" />
        {hasConnections && (
          <span className="flex items-center gap-1.5 text-xs text-amber bg-amber/15 px-2 py-0.5 rounded-full border border-amber/30 font-medium">
            <Link2 size={12} aria-label="Has connections" />
            <span>Connected</span>
          </span>
        )}
      </div>

      <h3 className="text-sm sm:text-base font-semibold text-ivory mb-1.5 leading-snug line-clamp-2">
        {activity.title}
      </h3>

      <p className="text-xs sm:text-sm text-ivory-muted font-mono mb-3">
        {formatDate(activity.timestamp)}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-border/40">
        <div className="flex flex-wrap items-center gap-1.5">
          {activity.category && (
            <span className="text-xs px-2.5 py-1 rounded-md bg-surface-light text-ivory-muted font-medium truncate max-w-[140px]">
              {activity.category}
            </span>
          )}
          {activity.location && (
            <span className="text-xs text-ivory-muted flex items-center gap-1 truncate max-w-[160px]">
              <MapPin size={12} className="shrink-0 text-amber-muted" />
              <span className="truncate">{truncate(activity.location, 24)}</span>
            </span>
          )}
        </div>

        {activity.amount != null && (
          <span className="text-xs sm:text-sm md:text-base font-bold text-ivory font-mono ml-auto">
            {formatCurrency(activity.amount, activity.currency)}
          </span>
        )}
      </div>
    </motion.button>
  );
});
