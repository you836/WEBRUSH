import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Database } from 'lucide-react';
import { SourceBadge } from '@/components/ui/SourceBadge';
import { PixelSwap } from '@/components/ui/PixelSwap';
import { formatDate } from '@/lib/formatting';
import type { StoryChapter } from '@/types';

export type NarrativeTone = 'editorial' | 'analyst' | 'poetic';

interface StoryChapterCardProps {
  chapter: StoryChapter;
  tone?: NarrativeTone;
  onExplore: (activityIds: string[]) => void;
}

function formatSummaryByTone(chapter: StoryChapter, tone: NarrativeTone): string {
  if (tone === 'analyst') {
    return `[TELEMETRY_LOG]: ${chapter.activityIds.length} discrete data records validated (${formatDate(chapter.timeRange.start)} → ${formatDate(chapter.timeRange.end)}). Metric signature: ${chapter.pattern}. Validated via deterministic multi-source clustering.`;
  }
  if (tone === 'poetic') {
    return `Fragments of lived time captured between ${formatDate(chapter.timeRange.start)} and ${formatDate(chapter.timeRange.end)}. Across ${chapter.activityIds.length} digital moments, an unmistakable cadence emerged: ${chapter.pattern.toLowerCase()}.`;
  }
  return chapter.summary;
}

export function StoryChapterCard({ chapter, tone = 'editorial', onExplore }: StoryChapterCardProps) {
  const [activeFace, setActiveFace] = useState(false);

  const borderColor = chapter.source === 'music'
    ? 'border-l-music'
    : chapter.source === 'banking'
    ? 'border-l-banking'
    : chapter.source === 'household'
    ? 'border-l-household'
    : 'border-l-amber';

  const summaryText = formatSummaryByTone(chapter, tone);

  const frontFace = (
    <div className="p-6 sm:p-7 flex flex-col justify-between h-full space-y-4">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            {chapter.source !== 'cross-source' ? (
              <SourceBadge source={chapter.source} size="md" />
            ) : (
              <span className="text-xs px-3 py-1 rounded-full bg-amber/15 text-amber font-semibold border border-amber/30">Cross-Dataset Overlap</span>
            )}
          </div>
          <span className="text-xs sm:text-sm text-ivory-muted font-mono font-medium">
            {formatDate(chapter.timeRange.start)} – {formatDate(chapter.timeRange.end)}
          </span>
        </div>

        <h3 className="font-serif text-xl sm:text-2xl md:text-3xl text-ivory leading-snug font-bold">
          {chapter.title}
        </h3>

        <p className="text-sm sm:text-base text-ivory-muted leading-relaxed">
          {summaryText}
        </p>
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs sm:text-sm px-3 py-1 rounded-lg bg-surface text-ivory-muted font-medium border border-border/40">
            Observed Pattern: {chapter.pattern}
          </span>
          <span className="text-[11px] text-amber/80 font-mono flex items-center gap-1">
            <Sparkles size={12} />
            <span>Hover / Click to Pixel-Swap</span>
          </span>
        </div>

        <div className="pt-3 border-t border-border/40 flex items-center justify-between">
          <span className="text-xs sm:text-sm text-ivory-muted/70 font-mono">{chapter.activityIds.length} source records</span>
          <span className="text-xs font-semibold text-amber flex items-center gap-1">
            <span>Inspect Evidence</span>
            <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </div>
  );

  const backFace = (
    <div className="p-6 sm:p-7 flex flex-col justify-between h-full bg-surface/95 space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-border/40">
          <div className="flex items-center gap-2 text-amber text-xs sm:text-sm font-semibold uppercase tracking-wider">
            <Database size={16} />
            <span>Empirical Telemetry & Evidence</span>
          </div>
          <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-amber/15 text-amber font-semibold border border-amber/30">
            {chapter.evidence.length} Signals
          </span>
        </div>

        <ul className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
          {chapter.evidence.map((e, i) => (
            <li key={i} className="text-xs sm:text-sm text-ivory flex items-start gap-2.5 bg-midnight/50 p-2 rounded-lg border border-border/30">
              <span className="text-amber mt-0.5">•</span>
              <span className="leading-snug">{e}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-3 border-t border-border/40 flex items-center justify-between">
        <span className="text-xs text-ivory-muted font-mono">{chapter.activityIds.length} records linked</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onExplore(chapter.activityIds);
          }}
          className="flex items-center gap-2 text-sm sm:text-base font-semibold text-amber hover:text-amber-muted transition-colors py-1.5 px-3 rounded-lg hover:bg-amber/10 active:scale-95 cursor-pointer"
        >
          <span>Examine in Archive</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`bg-charcoal/90 backdrop-blur-md border border-border/80 rounded-2xl border-l-4 ${borderColor} overflow-hidden shadow-lg hover:shadow-2xl transition-all h-full min-h-[320px] sm:min-h-[340px] flex flex-col`}
    >
      <PixelSwap
        firstContent={frontFace}
        secondContent={backFace}
        pixelSize={36}
        gap={2}
        pixelRadius={12}
        pixelSpin={8}
        pattern="diagonal"
        randomness={0.15}
        duration={600}
        pixelDuration={280}
        trigger="click"
        active={activeFace}
        onActiveChange={setActiveFace}
        className="h-full w-full flex-1"
      />
    </motion.article>
  );
}

