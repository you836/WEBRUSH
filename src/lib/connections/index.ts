import type { LifeActivity, Connection, ConnectionReason } from '@/types';
import { format, differenceInHours, differenceInDays, parseISO } from 'date-fns';

interface ConnectionCandidate {
  activityA: LifeActivity;
  activityB: LifeActivity;
  reasons: { reason: ConnectionReason; strength: number; signal: string }[];
}

/**
 * Discover meaningful relationships between activities using deterministic rules.
 * Returns connections sorted by strength (strongest first).
 */
export function discoverConnections(activities: LifeActivity[], maxConnections = 100): Connection[] {
  const connections: Connection[] = [];
  const seen = new Set<string>();

  // Index activities by date for efficient lookup
  const byDate = new Map<string, LifeActivity[]>();
  for (const act of activities) {
    const dateKey = act.timestamp.slice(0, 10);
    const group = byDate.get(dateKey) ?? [];
    group.push(act);
    byDate.set(dateKey, group);
  }

  // Index by category
  const byCategory = new Map<string, LifeActivity[]>();
  for (const act of activities) {
    if (!act.category) continue;
    const group = byCategory.get(act.category) ?? [];
    group.push(act);
    byCategory.set(act.category, group);
  }

  // 1. Shared date connections (different sources, same day)
  for (const [, group] of byDate) {
    if (group.length < 2) continue;
    const sourceGroups = new Map<string, LifeActivity[]>();
    for (const act of group) {
      const sg = sourceGroups.get(act.source) ?? [];
      sg.push(act);
      sourceGroups.set(act.source, sg);
    }
    const sources = [...sourceGroups.keys()];
    if (sources.length < 2) continue;

    // Create cross-source connections for the day
    for (let i = 0; i < sources.length; i++) {
      for (let j = i + 1; j < sources.length; j++) {
        const aGroup = sourceGroups.get(sources[i])!;
        const bGroup = sourceGroups.get(sources[j])!;
        // Pick representative activities (first from each source)
        const a = aGroup[0];
        const b = bGroup[0];
        const key = [a.id, b.id].sort().join('-');
        if (seen.has(key)) continue;
        seen.add(key);

        const dateStr = format(parseISO(a.timestamp), 'MMM d, yyyy');
        connections.push({
          id: crypto.randomUUID(),
          activities: [a.id, b.id],
          reason: 'shared-date',
          strength: 0.6 + Math.min(aGroup.length + bGroup.length, 10) * 0.03,
          explanation: `Activity from ${a.source} and ${b.source} occurred on the same day (${dateStr}). ${aGroup.length + bGroup.length} total activities recorded.`,
          signals: [
            `${aGroup.length} ${a.source} activities on this date`,
            `${bGroup.length} ${b.source} activities on this date`,
          ],
        });
      }
    }
  }

  // 2. Temporal proximity (activities within 2 hours, different sources)
  const sorted = [...activities].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < Math.min(i + 15, sorted.length); j++) {
      const a = sorted[i];
      const b = sorted[j];
      if (a.source === b.source) continue;
      const hours = Math.abs(differenceInHours(parseISO(a.timestamp), parseISO(b.timestamp)));
      if (hours > 3) break;
      if (hours > 2) continue;

      const key = [a.id, b.id].sort().join('-');
      if (seen.has(key)) continue;
      seen.add(key);

      const strength = Math.max(0.5, 1 - hours * 0.2);
      connections.push({
        id: crypto.randomUUID(),
        activities: [a.id, b.id],
        reason: 'temporal-proximity',
        strength,
        explanation: `These activities from ${a.source} and ${b.source} occurred within ${hours < 1 ? 'the same hour' : `${hours} hours`} of each other.`,
        signals: [
          `${a.title} (${a.source})`,
          `${b.title} (${b.source})`,
          `Time gap: ~${hours < 1 ? 'less than 1 hour' : `${hours} hours`}`,
        ],
      });
    }
  }

  // 3. Shared category connections
  for (const [category, group] of byCategory) {
    if (group.length < 3) continue;
    const sources = new Set(group.map(a => a.source));
    if (sources.size < 2) {
      // Same source repeated category — still interesting if enough
      if (group.length >= 5) {
        const representative = group.slice(0, 3);
        const ids = representative.map(a => a.id);
        const key = ids.sort().join('-');
        if (!seen.has(key)) {
          seen.add(key);
          connections.push({
            id: crypto.randomUUID(),
            activities: ids,
            reason: 'shared-category',
            strength: Math.min(0.4 + group.length * 0.05, 0.9),
            explanation: `"${category}" appears ${group.length} times across ${group[0].source} records. This recurring category suggests a pattern.`,
            signals: [
              `${group.length} occurrences in ${group[0].source}`,
              `First: ${format(parseISO(group[0].timestamp), 'MMM d')}`,
              `Last: ${format(parseISO(group[group.length - 1].timestamp), 'MMM d')}`,
            ],
          });
        }
      }
      continue;
    }

    // Cross-source shared category
    const bySource = new Map<string, LifeActivity[]>();
    for (const act of group) {
      const sg = bySource.get(act.source) ?? [];
      sg.push(act);
      bySource.set(act.source, sg);
    }
    const srcArr = [...bySource.entries()];
    const representative = srcArr.flatMap(([, acts]) => acts.slice(0, 1)).map(a => a.id);
    const key = representative.sort().join('-');
    if (seen.has(key)) continue;
    seen.add(key);

    connections.push({
      id: crypto.randomUUID(),
      activities: representative,
      reason: 'shared-category',
      strength: Math.min(0.5 + sources.size * 0.1 + group.length * 0.02, 0.95),
      explanation: `The category "${category}" appears across ${sources.size} different data sources (${[...sources].join(', ')}), with ${group.length} total records.`,
      signals: srcArr.map(([src, acts]) => `${acts.length} records in ${src}`),
    });
  }

  // 4. Activity clusters (days with 3+ activities from different sources)
  for (const [dateKey, group] of byDate) {
    const sources = new Set(group.map(a => a.source));
    if (group.length < 3 || sources.size < 2) continue;

    const ids = group.slice(0, 5).map(a => a.id);
    const key = `cluster-${dateKey}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const dateStr = format(parseISO(dateKey), 'MMM d, yyyy');
    connections.push({
      id: crypto.randomUUID(),
      activities: ids,
      reason: 'activity-cluster',
      strength: Math.min(0.5 + group.length * 0.08, 0.95),
      explanation: `${dateStr} shows a cluster of ${group.length} activities across ${sources.size} sources (${[...sources].join(', ')}). This was an unusually active day.`,
      signals: [
        `${group.length} total activities`,
        `${sources.size} different sources`,
        ...([...sources].map(s => `${group.filter(a => a.source === s).length} ${s} activities`)),
      ],
    });
  }

  // 5. Repeated keywords in titles
  const keywords = extractKeywords(activities);
  for (const [keyword, acts] of keywords) {
    if (acts.length < 3) continue;
    const sources = new Set(acts.map(a => a.source));
    const ids = acts.slice(0, 4).map(a => a.id);
    const key = `keyword-${keyword}`;
    if (seen.has(key)) continue;
    seen.add(key);

    connections.push({
      id: crypto.randomUUID(),
      activities: ids,
      reason: 'repeated-keyword',
      strength: Math.min(0.3 + acts.length * 0.08, 0.85),
      explanation: `The term "${keyword}" appears in ${acts.length} records${sources.size > 1 ? ` across ${sources.size} sources` : ''}. This repeated keyword may indicate a recurring interest or activity.`,
      signals: [
        `${acts.length} occurrences`,
        ...(sources.size > 1 ? [`Found in: ${[...sources].join(', ')}`] : []),
      ],
    });
  }

  return connections
    .sort((a, b) => b.strength - a.strength)
    .slice(0, maxConnections);
}

function extractKeywords(activities: LifeActivity[]): Map<string, LifeActivity[]> {
  const stopWords = new Set([
    'the', 'a', 'an', 'is', 'at', 'in', 'on', 'to', 'for', 'of', 'with',
    'and', 'or', 'but', 'not', 'from', 'by', 'as', 'it', 'its', 'this',
    'that', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may',
    'can', 'payment', 'transaction', 'purchase', 'bill', 'recharge', 'upi',
  ]);

  const keywordMap = new Map<string, LifeActivity[]>();

  for (const act of activities) {
    const words = act.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3 && !stopWords.has(w));

    for (const word of words) {
      const group = keywordMap.get(word) ?? [];
      group.push(act);
      keywordMap.set(word, group);
    }
  }

  return keywordMap;
}

/**
 * Get connections related to a specific activity
 */
export function getConnectionsForActivity(
  activityId: string,
  connections: Connection[]
): Connection[] {
  return connections.filter(c => c.activities.includes(activityId));
}

/**
 * Get all unique activity IDs connected to a given activity
 */
export function getConnectedActivityIds(
  activityId: string,
  connections: Connection[]
): string[] {
  const ids = new Set<string>();
  for (const conn of connections) {
    if (conn.activities.includes(activityId)) {
      for (const id of conn.activities) {
        if (id !== activityId) ids.add(id);
      }
    }
  }
  return [...ids];
}

/**
 * Get human-readable label for a connection reason
 */
export function getConnectionReasonLabel(reason: ConnectionReason): string {
  const labels: Record<ConnectionReason, string> = {
    'temporal-proximity': 'Close in Time',
    'shared-date': 'Same Day',
    'shared-category': 'Shared Category',
    'repeated-keyword': 'Repeated Keyword',
    'activity-cluster': 'Activity Cluster',
  };
  return labels[reason];
}
