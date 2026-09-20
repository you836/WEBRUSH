import { describe, it, expect } from 'vitest';
import { generateStoryChapters } from '@/lib/stories';
import type { LifeActivity } from '@/types';

const testActivities: LifeActivity[] = [
  {
    id: 'm-1',
    source: 'music',
    title: 'Focus Track 1',
    timestamp: '2026-01-10T10:00:00Z',
    category: 'Electronic',
    amount: 0,
    tags: ['music'],
    metadata: { durationMs: 200000, trackName: 'Focus Track 1', artist: 'Tycho' },
  },
  {
    id: 'm-2',
    source: 'music',
    title: 'Focus Track 2',
    timestamp: '2026-01-11T11:00:00Z',
    category: 'Electronic',
    amount: 0,
    tags: ['music'],
    metadata: { durationMs: 220000, trackName: 'Focus Track 2', artist: 'Tycho' },
  },
  {
    id: 'b-1',
    source: 'banking',
    title: 'Electronics Store Purchase',
    timestamp: '2026-01-15T15:00:00Z',
    category: 'Electronics',
    amount: 15000,
    tags: ['shopping'],
    metadata: { merchant: 'Apple Store', type: 'debit' },
  },
  {
    id: 'h-1',
    source: 'household',
    title: 'Weekly Supermarket Supplies',
    timestamp: '2026-01-18T18:00:00Z',
    category: 'Grocery',
    amount: 2400,
    tags: ['groceries'],
    metadata: { merchant: 'Nature Basket' },
  },
];

describe('Story Synthesis Engine', () => {
  it('should generate structured narrative story chapters from multi-modal events', () => {
    const chapters = generateStoryChapters(testActivities);
    expect(chapters.length).toBeGreaterThan(0);

    for (const chapter of chapters) {
      expect(chapter.id).toBeTruthy();
      expect(chapter.title).toBeTruthy();
      expect(chapter.summary).toBeTruthy();
      expect(Array.isArray(chapter.activityIds)).toBe(true);
      expect(chapter.activityIds.length).toBeGreaterThan(0);
      expect(chapter.timeRange).toBeDefined();
      expect(chapter.timeRange.start).toBeTruthy();
      expect(chapter.timeRange.end).toBeTruthy();
      expect(chapter.pattern).toBeTruthy();
      expect(Array.isArray(chapter.evidence)).toBe(true);
    }
  });

  it('should synthesize valid patterns and evidence for each narrative chapter', () => {
    const chapters = generateStoryChapters(testActivities);
    const firstChapter = chapters[0];
    expect(firstChapter.evidence.length).toBeGreaterThan(0);
    expect(firstChapter.pattern.length).toBeGreaterThan(0);
  });
});
