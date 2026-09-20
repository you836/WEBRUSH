import { motion } from 'motion/react';
import { SourceBadge } from './SourceBadge';
import type { LifeSource } from '@/types';
import type { ReactNode } from 'react';

interface StatCardProps {
  value: string | number;
  label: string;
  icon?: ReactNode;
  source?: LifeSource;
  sublabel?: string;
}

export function StatCard({ value, label, icon, source, sublabel }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-charcoal/90 backdrop-blur-md border border-border/80 rounded-xl p-5 sm:p-6 lg:p-7 transition-all hover:border-amber/50 hover:shadow-xl flex flex-col justify-between h-full min-h-[160px] sm:min-h-[180px]"
    >
      <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4">
        {icon && <span className="text-ivory-muted text-lg sm:text-xl">{icon}</span>}
        {source && <SourceBadge source={source} size="md" />}
      </div>
      <div>
        <p className="font-serif text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-ivory tracking-tight truncate font-semibold">
          {value}
        </p>
        <p className="text-sm sm:text-base lg:text-lg text-ivory-muted mt-1.5 font-medium">{label}</p>
        {sublabel && <p className="text-xs sm:text-sm text-ivory-muted/70 mt-1 truncate">{sublabel}</p>}
      </div>
    </motion.div>
  );
}


