# LIFE / RECEIPTS — Internal Services & Type Contracts

## Core Types (`@/types`)

### `LifeActivity`
Canonical schema for all normalized life stream events:
```typescript
export interface LifeActivity {
  id: string;
  source: 'music' | 'banking' | 'household';
  title: string;
  timestamp: string; // ISO-8601
  amount?: number;
  category?: string;
  metadata: Record<string, unknown>;
}
```

### `Connection`
Relational edge discovered between two or more events:
```typescript
export interface Connection {
  id: string;
  reason: ConnectionReason;
  explanation: string;
  strength: number; // 0.0 - 1.0
  activities: string[]; // activity IDs
  signals: string[];
}
```

### `StoryChapter`
Synthesized narrative cluster:
```typescript
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
```

---

## Service Layer (`@/services`)

### `DataService`
- `fetchAllActivities(): Promise<LifeActivity[]>`
- `computeStatistics(activities: LifeActivity[]): DataStats`
- `mergeImportedActivities(existing: LifeActivity[], incoming: LifeActivity[]): { activities: LifeActivity[]; stats: DataStats }`

### `CorrelationService`
- `findCorrelations(activities: LifeActivity[]): Connection[]`
- `getReasonLabel(reason: ConnectionReason): string`

### `StoryService`
- `synthesizeChapters(activities: LifeActivity[]): StoryChapter[]`
