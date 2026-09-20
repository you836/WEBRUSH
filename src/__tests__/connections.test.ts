import { describe, it, expect } from 'vitest';
import { discoverConnections, getConnectionReasonLabel } from '@/lib/connections';
import type { LifeActivity } from '@/types';

const mockActivities: LifeActivity[] = [
  {
    id: 'act-1',
    source: 'music',
    title: 'Midnight Synthwave Track',
    timestamp: '2026-03-15T23:45:00Z',
    category: 'Electronic',
    amount: 0,
    tags: ['focus', 'night', 'music'],
    metadata: { durationMs: 240000, trackName: 'Midnight Synthwave Track', artist: 'Kavinsky' },
  },
  {
    id: 'act-2',
    source: 'banking',
    title: 'Swiggy Late Night Dinner',
    timestamp: '2026-03-15T23:55:00Z',
    category: 'Dining',
    amount: 380,
    tags: ['food', 'night', 'upi'],
    metadata: { merchant: 'Swiggy', type: 'debit' },
  },
  {
    id: 'act-3',
    source: 'household',
    title: 'Blue Tokai Coffee Beans',
    timestamp: '2026-03-16T09:00:00Z',
    category: 'Grocery',
    amount: 550,
    tags: ['coffee', 'grocery'],
    metadata: { merchant: 'Blue Tokai' },
  },
  {
    id: 'act-4',
    source: 'music',
    title: 'Morning Acoustic Jam',
    timestamp: '2026-03-16T09:15:00Z',
    category: 'Acoustic',
    amount: 0,
    tags: ['morning', 'coffee', 'music'],
    metadata: { durationMs: 180000, trackName: 'Morning Acoustic Jam', artist: 'Jack Johnson' },
  },
];

describe('Heuristic Connections Engine', () => {
  it('should discover connections between cross-domain events', () => {
    const connections = discoverConnections(mockActivities);
    expect(connections.length).toBeGreaterThan(0);

    const sharedDateConn = connections.find(c => c.activities.includes('act-1') && c.activities.includes('act-2'));
    expect(sharedDateConn).toBeDefined();
    if (sharedDateConn) {
      expect(sharedDateConn.strength).toBeGreaterThan(0.3);
      expect(sharedDateConn.explanation).toBeTruthy();
    }
  });

  it('should generate accurate human-readable labels for connection reason types', () => {
    expect(getConnectionReasonLabel('temporal-proximity')).toBe('Close in Time');
    expect(getConnectionReasonLabel('shared-date')).toBe('Same Day');
    expect(getConnectionReasonLabel('shared-category')).toBe('Shared Category');
    expect(getConnectionReasonLabel('repeated-keyword')).toBe('Repeated Keyword');
    expect(getConnectionReasonLabel('activity-cluster')).toBe('Activity Cluster');
  });

  it('should handle empty or single-activity inputs gracefully without errors', () => {
    expect(discoverConnections([])).toEqual([]);
    expect(discoverConnections([mockActivities[0]])).toEqual([]);
  });
});
