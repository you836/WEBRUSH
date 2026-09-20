import { Music, CreditCard, Home } from 'lucide-react';
import type { LifeSource } from '@/types';

const SOURCE_CONFIG: Record<LifeSource, { icon: typeof Music; label: string; color: string; bg: string }> = {
  music: { icon: Music, label: 'Music', color: 'text-music', bg: 'bg-music/15' },
  banking: { icon: CreditCard, label: 'Banking', color: 'text-banking', bg: 'bg-banking/15' },
  household: { icon: Home, label: 'Household', color: 'text-household', bg: 'bg-household/15' },
};

interface SourceBadgeProps {
  source: LifeSource;
  size?: 'sm' | 'md';
}

export function SourceBadge({ source, size = 'sm' }: SourceBadgeProps) {
  const config = SOURCE_CONFIG[source];
  const Icon = config.icon;
  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${config.color} ${config.bg}`}>
      <Icon size={iconSize} />
      {size === 'md' && config.label}
    </span>
  );
}
