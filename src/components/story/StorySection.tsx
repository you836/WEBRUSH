import { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Sparkles, Feather, Binary, Landmark } from 'lucide-react';
import { EchoText } from '@/components/ui/EchoText';
import { StoryChapterCard, type NarrativeTone } from './StoryChapterCard';
import type { StoryChapter } from '@/types';

interface StorySectionProps {
  chapters: StoryChapter[];
  onExplore: (activityIds: string[]) => void;
}

export function StorySection({ chapters, onExplore }: StorySectionProps) {
  const [tone, setTone] = useState<NarrativeTone>('editorial');

  return (
    <div className="space-y-8 sm:space-y-12 w-full">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={18} className="text-amber" />
              <span className="text-sm font-semibold text-amber uppercase tracking-widest">Observable Life Narrative</span>
            </div>

            <div className="mb-3">
              <EchoText
                text="Narrative Chapters"
                fontSize="clamp(2.5rem, 6vw, 4rem)"
                fontWeight={700}
                color="#f5f0e8"
                tint="#a78bfa"
                direction="right"
                echoes={8}
                offset={18}
                className="font-serif tracking-tight"
              />
            </div>

            <p className="text-sm sm:text-base md:text-lg text-ivory-muted max-w-3xl leading-relaxed">
              Autonomous narrative synthesis generated strictly from observable temporal clusters and recurring digital life habits.
            </p>
            <p className="text-xs sm:text-sm text-ivory-muted/70 mt-2 flex items-center gap-2 font-mono">
              <Sparkles size={14} className="text-amber" />
              <span>All insights maintain statistical grounding without fictionalized biographical attribution.</span>
            </p>
          </div>

          {/* Tone Switcher Control */}
          <div className="flex items-center bg-charcoal/90 border border-border/80 rounded-xl p-1.5 gap-1 shrink-0">
            <span className="text-xs text-ivory-muted font-mono px-2 hidden sm:inline">Tone:</span>
            <button
              onClick={() => setTone('editorial')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                tone === 'editorial'
                  ? 'bg-amber text-midnight font-bold shadow-md'
                  : 'text-ivory-muted hover:text-ivory hover:bg-surface'
              }`}
            >
              <Landmark size={14} />
              <span>Editorial Museum</span>
            </button>
            <button
              onClick={() => setTone('analyst')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                tone === 'analyst'
                  ? 'bg-amber text-midnight font-bold shadow-md'
                  : 'text-ivory-muted hover:text-ivory hover:bg-surface'
              }`}
            >
              <Binary size={14} />
              <span>Data Analyst</span>
            </button>
            <button
              onClick={() => setTone('poetic')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                tone === 'poetic'
                  ? 'bg-amber text-midnight font-bold shadow-md'
                  : 'text-ivory-muted hover:text-ivory hover:bg-surface'
              }`}
            >
              <Feather size={14} />
              <span>Poetic Chronology</span>
            </button>
          </div>
        </div>
      </motion.div>

      {chapters.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
          {chapters.map((chapter) => (
            <StoryChapterCard
              key={chapter.id}
              chapter={chapter}
              tone={tone}
              onExplore={onExplore}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-charcoal border border-border rounded-2xl">
          <BookOpen size={28} className="text-ivory-muted/30 mx-auto mb-3" />
          <p className="text-lg font-medium text-ivory">No story chapters identified yet</p>
        </div>
      )}
    </div>
  );
}
