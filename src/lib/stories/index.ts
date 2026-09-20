import type { LifeActivity, StoryChapter, LifeSource } from '@/types';
import { format, parseISO, differenceInDays } from 'date-fns';

/**
 * Generate story chapters from actual data patterns.
 * Each chapter is derived from observable patterns—no invented narratives.
 */
export function generateStoryChapters(activities: LifeActivity[]): StoryChapter[] {
  const chapters: StoryChapter[] = [];

  // Group by month for temporal analysis
  const byMonth = groupByMonth(activities);
  const bySource = groupBySource(activities);

  // 1. Listening Eras (from music data)
  const musicActivities = bySource.get('music') ?? [];
  if (musicActivities.length > 0) {
    const listeningEras = detectListeningEras(musicActivities);
    chapters.push(...listeningEras);
  }

  // 2. Spending patterns (from banking + household)
  const spendingActivities = [
    ...(bySource.get('banking') ?? []),
    ...(bySource.get('household') ?? []),
  ].filter(a => a.amount && a.amount > 0);
  if (spendingActivities.length > 0) {
    const spendingChapters = detectSpendingPatterns(spendingActivities);
    chapters.push(...spendingChapters);
  }

  // 3. Most active periods
  const clusterChapters = detectActivityClusters(activities, byMonth);
  chapters.push(...clusterChapters);

  // 4. Cross-source overlaps
  const overlapChapters = detectCrossSourceOverlaps(activities, byMonth);
  chapters.push(...overlapChapters);

  // 5. Category-based chapters
  const categoryChapters = detectRecurringCategories(activities);
  chapters.push(...categoryChapters);

  return chapters.slice(0, 8); // Limit to 8 most interesting chapters
}

function groupByMonth(activities: LifeActivity[]): Map<string, LifeActivity[]> {
  const map = new Map<string, LifeActivity[]>();
  for (const act of activities) {
    const key = act.timestamp.slice(0, 7); // YYYY-MM
    const group = map.get(key) ?? [];
    group.push(act);
    map.set(key, group);
  }
  return map;
}

function groupBySource(activities: LifeActivity[]): Map<LifeSource, LifeActivity[]> {
  const map = new Map<LifeSource, LifeActivity[]>();
  for (const act of activities) {
    const group = map.get(act.source) ?? [];
    group.push(act);
    map.set(act.source, group);
  }
  return map;
}

function detectListeningEras(musicActivities: LifeActivity[]): StoryChapter[] {
  const chapters: StoryChapter[] = [];
  const sorted = [...musicActivities].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  if (sorted.length === 0) return chapters;

  // Find most-listened artists per quarter
  const quarters: { label: string; start: string; end: string; acts: LifeActivity[] }[] = [];
  const quarterLabels = ['Q1 (Jan-Mar)', 'Q2 (Apr-Jun)', 'Q3 (Jul-Sep)', 'Q4 (Oct-Dec)'];

  for (let q = 0; q < 4; q++) {
    const qStart = `2024-${String(q * 3 + 1).padStart(2, '0')}-01`;
    const qEnd = `2024-${String(q * 3 + 3).padStart(2, '0')}-31`;
    const qActs = sorted.filter(a => a.timestamp >= qStart && a.timestamp <= qEnd);
    if (qActs.length > 0) {
      quarters.push({ label: quarterLabels[q], start: qStart, end: qEnd, acts: qActs });
    }
  }

  for (const quarter of quarters) {
    const artistCounts = new Map<string, number>();
    for (const act of quarter.acts) {
      const artist = (act.metadata.artist as string) ?? 'Unknown';
      artistCounts.set(artist, (artistCounts.get(artist) ?? 0) + 1);
    }
    const topArtists = [...artistCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    if (topArtists.length === 0) continue;

    const totalMinutes = quarter.acts.reduce((sum, a) => {
      const dur = (a.metadata.durationMs as number) ?? 0;
      return sum + dur / 60000;
    }, 0);

    chapters.push({
      id: crypto.randomUUID(),
      title: `Listening Era: ${quarter.label}`,
      timeRange: { start: quarter.start, end: quarter.end },
      summary: `The data shows ${quarter.acts.length} tracks played during ${quarter.label} 2024, totaling approximately ${Math.round(totalMinutes)} minutes. The most frequently appearing artist${topArtists.length > 1 ? 's were' : ' was'} ${topArtists.map(([name, count]) => `${name} (${count} plays)`).join(', ')}.`,
      pattern: `Dominant listening: ${topArtists[0][0]}`,
      evidence: [
        `${quarter.acts.length} tracks played in this period`,
        `~${Math.round(totalMinutes)} minutes of listening time`,
        ...topArtists.map(([name, count]) => `${name}: ${count} plays`),
      ],
      activityIds: quarter.acts.slice(0, 10).map(a => a.id),
      source: 'music',
    });
  }

  return chapters.slice(0, 2); // Keep best 2 listening eras
}

function detectSpendingPatterns(spendingActivities: LifeActivity[]): StoryChapter[] {
  const chapters: StoryChapter[] = [];
  const sorted = [...spendingActivities].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Find the highest spending month
  const monthlySpending = new Map<string, { total: number; acts: LifeActivity[] }>();
  for (const act of sorted) {
    const month = act.timestamp.slice(0, 7);
    const entry = monthlySpending.get(month) ?? { total: 0, acts: [] };
    entry.total += act.amount ?? 0;
    entry.acts.push(act);
    monthlySpending.set(month, entry);
  }

  const topMonth = [...monthlySpending.entries()]
    .sort((a, b) => b[1].total - a[1].total)[0];

  if (topMonth) {
    const [month, data] = topMonth;
    const categoryCounts = new Map<string, number>();
    for (const act of data.acts) {
      if (act.category) {
        categoryCounts.set(act.category, (categoryCounts.get(act.category) ?? 0) + (act.amount ?? 0));
      }
    }
    const topCategories = [...categoryCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    chapters.push({
      id: crypto.randomUUID(),
      title: `Peak Spending: ${format(parseISO(month + '-01'), 'MMMM yyyy')}`,
      timeRange: { start: `${month}-01`, end: `${month}-28` },
      summary: `${format(parseISO(month + '-01'), 'MMMM yyyy')} recorded the highest spending activity with ₹${Math.round(data.total).toLocaleString()} across ${data.acts.length} transactions. The top spending categories were ${topCategories.map(([cat, amt]) => `${cat} (₹${Math.round(amt).toLocaleString()})`).join(', ')}.`,
      pattern: `Highest spending month in the dataset`,
      evidence: [
        `Total: ₹${Math.round(data.total).toLocaleString()}`,
        `${data.acts.length} transactions`,
        ...topCategories.map(([cat, amt]) => `${cat}: ₹${Math.round(amt).toLocaleString()}`),
      ],
      activityIds: data.acts.slice(0, 10).map(a => a.id),
      source: 'cross-source',
    });
  }

  // Find the most frequent spending category
  const allCategories = new Map<string, LifeActivity[]>();
  for (const act of sorted) {
    if (!act.category) continue;
    const group = allCategories.get(act.category) ?? [];
    group.push(act);
    allCategories.set(act.category, group);
  }

  const topCategory = [...allCategories.entries()]
    .sort((a, b) => b[1].length - a[1].length)[0];

  if (topCategory) {
    const [category, acts] = topCategory;
    const totalSpent = acts.reduce((sum, a) => sum + (a.amount ?? 0), 0);
    const dateRange = {
      start: acts[0].timestamp.slice(0, 10),
      end: acts[acts.length - 1].timestamp.slice(0, 10),
    };

    chapters.push({
      id: crypto.randomUUID(),
      title: `Recurring Pattern: ${category}`,
      timeRange: dateRange,
      summary: `"${category}" is the most frequently recurring spending category, with ${acts.length} transactions totaling ₹${Math.round(totalSpent).toLocaleString()}. This pattern spans from ${format(parseISO(dateRange.start), 'MMM d')} to ${format(parseISO(dateRange.end), 'MMM d, yyyy')}.`,
      pattern: `Most frequent spending category`,
      evidence: [
        `${acts.length} transactions`,
        `Total: ₹${Math.round(totalSpent).toLocaleString()}`,
        `Average: ₹${Math.round(totalSpent / acts.length).toLocaleString()} per transaction`,
      ],
      activityIds: acts.slice(0, 10).map(a => a.id),
      source: 'cross-source',
    });
  }

  return chapters;
}

function detectActivityClusters(
  activities: LifeActivity[],
  byMonth: Map<string, LifeActivity[]>
): StoryChapter[] {
  const chapters: StoryChapter[] = [];

  // Find the most active month
  const topMonth = [...byMonth.entries()]
    .sort((a, b) => b[1].length - a[1].length)[0];

  if (topMonth) {
    const [month, acts] = topMonth;
    const sources = new Set(acts.map(a => a.source));

    chapters.push({
      id: crypto.randomUUID(),
      title: `Most Active Period: ${format(parseISO(month + '-01'), 'MMMM yyyy')}`,
      timeRange: { start: `${month}-01`, end: `${month}-28` },
      summary: `${format(parseISO(month + '-01'), 'MMMM yyyy')} was the most active month in the dataset, with ${acts.length} total activities across ${sources.size} source${sources.size > 1 ? 's' : ''} (${[...sources].join(', ')}).`,
      pattern: `Peak activity month`,
      evidence: [
        `${acts.length} total activities`,
        `${sources.size} data sources represented`,
        ...[...sources].map(s => `${acts.filter(a => a.source === s).length} ${s} records`),
      ],
      activityIds: acts.slice(0, 10).map(a => a.id),
      source: 'cross-source',
    });
  }

  // Find the most active day
  const byDate = new Map<string, LifeActivity[]>();
  for (const act of activities) {
    const dateKey = act.timestamp.slice(0, 10);
    const group = byDate.get(dateKey) ?? [];
    group.push(act);
    byDate.set(dateKey, group);
  }

  const topDay = [...byDate.entries()]
    .sort((a, b) => b[1].length - a[1].length)[0];

  if (topDay && topDay[1].length >= 3) {
    const [date, acts] = topDay;
    const sources = new Set(acts.map(a => a.source));

    chapters.push({
      id: crypto.randomUUID(),
      title: `Busiest Day: ${format(parseISO(date), 'EEEE, MMM d, yyyy')}`,
      timeRange: { start: date, end: date },
      summary: `${format(parseISO(date), 'MMMM d, yyyy')} stands out as the single busiest day in the dataset, with ${acts.length} recorded activities spanning ${[...sources].join(' and ')}.`,
      pattern: `Highest single-day activity count`,
      evidence: [
        `${acts.length} activities in one day`,
        ...[...sources].map(s => `${acts.filter(a => a.source === s).length} ${s} activities`),
      ],
      activityIds: acts.map(a => a.id),
      source: 'cross-source',
    });
  }

  return chapters;
}

function detectCrossSourceOverlaps(
  activities: LifeActivity[],
  byMonth: Map<string, LifeActivity[]>
): StoryChapter[] {
  const chapters: StoryChapter[] = [];

  // Find months where all three sources have data
  for (const [month, acts] of byMonth) {
    const sources = new Set(acts.map(a => a.source));
    if (sources.size < 3) continue;

    const musicCount = acts.filter(a => a.source === 'music').length;
    const bankingCount = acts.filter(a => a.source === 'banking').length;
    const householdCount = acts.filter(a => a.source === 'household').length;

    chapters.push({
      id: crypto.randomUUID(),
      title: `Cross-Source Overlap: ${format(parseISO(month + '-01'), 'MMMM yyyy')}`,
      timeRange: { start: `${month}-01`, end: `${month}-28` },
      summary: `In ${format(parseISO(month + '-01'), 'MMMM yyyy')}, all three data sources show activity: ${musicCount} music plays, ${bankingCount} banking transactions, and ${householdCount} household records. These patterns overlap in time, but the data does not establish a direct causal relationship between them.`,
      pattern: `All data sources active simultaneously`,
      evidence: [
        `Music: ${musicCount} tracks`,
        `Banking: ${bankingCount} transactions`,
        `Household: ${householdCount} records`,
        `Total: ${acts.length} activities`,
      ],
      activityIds: acts.slice(0, 10).map(a => a.id),
      source: 'cross-source',
    });

    if (chapters.length >= 2) break; // Limit cross-source chapters
  }

  return chapters.slice(0, 1);
}

function detectRecurringCategories(activities: LifeActivity[]): StoryChapter[] {
  const chapters: StoryChapter[] = [];

  // Find categories that appear in multiple months
  const categoryMonths = new Map<string, Set<string>>();
  for (const act of activities) {
    if (!act.category) continue;
    const month = act.timestamp.slice(0, 7);
    const months = categoryMonths.get(act.category) ?? new Set();
    months.add(month);
    categoryMonths.set(act.category, months);
  }

  const recurring = [...categoryMonths.entries()]
    .filter(([, months]) => months.size >= 4)
    .sort((a, b) => b[1].size - a[1].size);

  if (recurring.length > 0) {
    const [category, months] = recurring[0];
    const relevantActs = activities.filter(a => a.category === category);
    const sorted = relevantActs.sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    chapters.push({
      id: crypto.randomUUID(),
      title: `Year-Long Pattern: ${category}`,
      timeRange: {
        start: sorted[0].timestamp.slice(0, 10),
        end: sorted[sorted.length - 1].timestamp.slice(0, 10),
      },
      summary: `"${category}" appears consistently across ${months.size} months, with ${relevantActs.length} total records. A recurring pattern appears in this category, suggesting it represents a regular activity or routine.`,
      pattern: `Consistent presence across ${months.size} months`,
      evidence: [
        `${relevantActs.length} total occurrences`,
        `Active in ${months.size} different months`,
        `Months: ${[...months].sort().map(m => format(parseISO(m + '-01'), 'MMM')).join(', ')}`,
      ],
      activityIds: sorted.slice(0, 10).map(a => a.id),
      source: relevantActs[0].source,
    });
  }

  return chapters;
}
