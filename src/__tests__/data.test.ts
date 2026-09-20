import { describe, it, expect } from 'vitest';
import { computeStats } from '@/data';
import type { LifeActivity } from '@/types';

const sampleActivities: LifeActivity[] = [
  {
    id: 's-1',
    source: 'music',
    title: 'Song A',
    timestamp: '2026-02-01T10:00:00Z',
    category: 'Indie',
    amount: 0,
    tags: ['music'],
    metadata: { durationMs: 300000, trackName: 'Song A', artist: 'Artist 1' },
  },
  {
    id: 's-2',
    source: 'banking',
    title: 'Cafe Espresso',
    timestamp: '2026-02-02T11:00:00Z',
    category: 'Dining',
    amount: 250,
    tags: ['coffee'],
    metadata: { merchant: 'Cafe', type: 'debit' },
  },
  {
    id: 's-3',
    source: 'household',
    title: 'Pantry Restock',
    timestamp: '2026-02-03T12:00:00Z',
    category: 'Grocery',
    amount: 1200,
    tags: ['grocery'],
    metadata: { merchant: 'Market' },
  },
];

describe('Data Aggregation & Statistics Math', () => {
  it('should compute exact multi-modal totals and source counts', () => {
    const stats = computeStats(sampleActivities);
    expect(stats.totalActivities).toBe(3);
    expect(stats.sources.music).toBe(1);
    expect(stats.sources.banking).toBe(1);
    expect(stats.sources.household).toBe(1);
    expect(stats.totalSpending).toBe(1450); // 250 + 1200
  });

  it('should compute top categories accurately', () => {
    const stats = computeStats(sampleActivities);
    expect(stats.topCategories.length).toBeGreaterThan(0);
    const groceryCat = stats.topCategories.find(c => c.name === 'Grocery');
    expect(groceryCat).toBeDefined();
    expect(groceryCat?.count).toBe(1);
  });
});
