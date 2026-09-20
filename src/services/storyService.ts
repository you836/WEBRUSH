import { generateStoryChapters } from '@/lib/stories';
import type { LifeActivity, StoryChapter } from '@/types';

/**
 * Story Service - Domain service for multi-perspective narrative generation
 */
export class StoryService {
  public static synthesizeChapters(activities: LifeActivity[]): StoryChapter[] {
    if (!activities || activities.length === 0) return [];
    return generateStoryChapters(activities);
  }

  public static filterChaptersBySource(
    chapters: StoryChapter[],
    source: string
  ): StoryChapter[] {
    if (source === 'all') return chapters;
    return chapters.filter(c => c.source === source);
  }
}
