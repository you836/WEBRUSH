import { loadAllData, computeStats } from '@/data';
import type { LifeActivity, DataStats } from '@/types';

/**
 * Data Service - Pure client-side Data Access Layer
 */
export class DataService {
  private static cachedActivities: LifeActivity[] | null = null;
  private static cachedStats: DataStats | null = null;

  public static async fetchAllActivities(): Promise<LifeActivity[]> {
    if (this.cachedActivities) {
      return this.cachedActivities;
    }
    const data = await loadAllData();
    this.cachedActivities = data;
    this.cachedStats = computeStats(data);
    return data;
  }

  public static computeStatistics(activities: LifeActivity[]): DataStats {
    return computeStats(activities);
  }

  public static mergeImportedActivities(
    existing: LifeActivity[],
    incoming: LifeActivity[]
  ): { activities: LifeActivity[]; stats: DataStats } {
    const merged = [...incoming, ...existing];
    const stats = computeStats(merged);
    this.cachedActivities = merged;
    this.cachedStats = stats;
    return { activities: merged, stats };
  }

  public static clearCache(): void {
    this.cachedActivities = null;
    this.cachedStats = null;
  }
}
