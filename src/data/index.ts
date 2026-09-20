import Papa from 'papaparse';
import type { LifeActivity, DataStats, LifeSource } from '@/types';
import { normalizeSpotifyData } from './spotify';
import type { SpotifyRecord } from './spotify';
import { normalizeBankingData } from './banking';
import type { BankingRecord } from './banking';
import { normalizeHouseholdData } from './household';
import type { HouseholdRecord } from './household';

async function fetchAndParse<T>(url: string): Promise<T[]> {
  const response = await fetch(url);
  const text = await response.text();
  const result = Papa.parse<T>(text, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false, // Keep as strings, we normalize ourselves
  });
  return result.data;
}

export async function loadAllData(): Promise<LifeActivity[]> {
  const [spotifyRaw, bankingRaw, householdRaw] = await Promise.all([
    fetchAndParse<SpotifyRecord>('/data/spotify.csv'),
    fetchAndParse<BankingRecord>('/data/banking.csv'),
    fetchAndParse<HouseholdRecord>('/data/household.csv'),
  ]);

  const spotify = normalizeSpotifyData(spotifyRaw);
  const banking = normalizeBankingData(bankingRaw);
  const household = normalizeHouseholdData(householdRaw);

  return [...spotify, ...banking, ...household].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export function computeStats(activities: LifeActivity[]): DataStats {
  const sources: Record<LifeSource, number> = { music: 0, banking: 0, household: 0 };
  const categoryMap = new Map<string, number>();
  const monthSourceMap = new Map<string, Map<LifeSource, number>>();
  const artistMap = new Map<string, number>();

  let totalSpending = 0;
  let totalIncome = 0;
  let totalListeningMs = 0;
  let musicCount = 0;
  let earliest = '9999';
  let latest = '0000';

  for (const act of activities) {
    sources[act.source]++;

    if (act.timestamp < earliest) earliest = act.timestamp;
    if (act.timestamp > latest) latest = act.timestamp;

    if (act.category) {
      categoryMap.set(act.category, (categoryMap.get(act.category) ?? 0) + 1);
    }

    // Monthly distribution
    const month = act.timestamp.slice(0, 7);
    if (!monthSourceMap.has(month)) monthSourceMap.set(month, new Map());
    const msm = monthSourceMap.get(month)!;
    msm.set(act.source, (msm.get(act.source) ?? 0) + 1);

    // Source-specific stats
    if (act.source === 'music') {
      const dur = (act.metadata.durationMs as number) ?? 0;
      totalListeningMs += dur;
      musicCount++;
      const artist = act.metadata.artist as string;
      if (artist) {
        artistMap.set(artist, (artistMap.get(artist) ?? 0) + 1);
      }
    }

    if (act.source === 'banking' || act.source === 'household') {
      if (act.amount) {
        const isIncome = act.metadata.incomeExpense === 'Income' ||
          act.metadata.creditDebit === 'credit';
        if (isIncome) {
          totalIncome += act.amount;
        } else {
          totalSpending += act.amount;
        }
      }
    }
  }

  const topCategories = [...categoryMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  const monthlyDistribution: DataStats['monthlyDistribution'] = [];
  for (const [month, srcMap] of [...monthSourceMap.entries()].sort()) {
    for (const [source, count] of srcMap) {
      monthlyDistribution.push({ month, count, source });
    }
  }

  const topArtists = [...artistMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, plays]) => ({ name, plays }));

  return {
    totalActivities: activities.length,
    sources,
    dateRange: { earliest, latest },
    topCategories,
    monthlyDistribution,
    totalSpending,
    totalIncome,
    avgListeningMinutes: musicCount > 0 ? (totalListeningMs / musicCount) / 60000 : 0,
    topArtists,
  };
}
