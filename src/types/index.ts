export type LifeSource = 'music' | 'banking' | 'household';

export type ConnectionReason =
  | 'temporal-proximity'
  | 'shared-date'
  | 'shared-category'
  | 'repeated-keyword'
  | 'activity-cluster';

export interface LifeActivity {
  id: string;
  source: LifeSource;
  timestamp: string;
  title: string;
  description?: string;
  category?: string;
  amount?: number;
  currency?: string;
  location?: string;
  tags: string[];
  metadata: Record<string, unknown>;
}

export interface Connection {
  id: string;
  activities: string[];
  reason: ConnectionReason;
  strength: number;
  explanation: string;
  signals: string[];
}

export interface StoryChapter {
  id: string;
  title: string;
  timeRange: { start: string; end: string };
  summary: string;
  pattern: string;
  evidence: string[];
  activityIds: string[];
  source: LifeSource | 'cross-source';
}

export interface DataStats {
  totalActivities: number;
  sources: Record<LifeSource, number>;
  dateRange: { earliest: string; latest: string };
  topCategories: { name: string; count: number }[];
  monthlyDistribution: { month: string; count: number; source: LifeSource }[];
  totalSpending: number;
  totalIncome: number;
  avgListeningMinutes: number;
  topArtists: { name: string; plays: number }[];
}

export interface FilterState {
  search: string;
  sources: LifeSource[];
  categories: string[];
  dateRange: { start: string | null; end: string | null };
  sortBy: 'date-asc' | 'date-desc' | 'amount-asc' | 'amount-desc' | 'title';
}

export type ActiveSection = 'hero' | 'insights' | 'gallery' | 'archive' | 'connections' | 'stories' | 'journey';
