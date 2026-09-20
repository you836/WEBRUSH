import { useState, useMemo, useCallback, useEffect } from 'react';
import { useActiveSection } from '@/hooks/useActiveSection';
import { loadAllData, computeStats } from '@/data';
import { discoverConnections } from '@/lib/connections';
import { generateStoryChapters } from '@/lib/stories';
import { Navigation } from '@/components/layout/Navigation';
import { HeroSection } from '@/components/hero/HeroSection';
import { InsightDashboard } from '@/components/insights/InsightDashboard';
import { MemoryWallSection } from '@/components/gallery/MemoryWallSection';
import { ArchiveExplorer } from '@/components/archive/ArchiveExplorer';
import { ConnectionExplorer } from '@/components/connections/ConnectionExplorer';
import { StorySection } from '@/components/story/StorySection';
import { JourneyTimeline } from '@/components/journey/JourneyTimeline';
import { ConnectionPanel } from '@/components/connections/ConnectionPanel';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { KeyboardShortcutsModal } from '@/components/ui/KeyboardShortcutsModal';
import { DataImportModal } from '@/components/archive/DataImportModal';
import { DataExportModal } from '@/components/archive/DataExportModal';
import type { LifeActivity, DataStats } from '@/types';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeSection, navigateTo] = useActiveSection();
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<LifeActivity[]>([]);
  const [stats, setStats] = useState<DataStats | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showExport, setShowExport] = useState(false);

  useEffect(() => {
    loadAllData().then(data => {
      setActivities(data);
      setStats(computeStats(data));
      setLoading(false);
    });
  }, []);

  const connections = useMemo(() => (activities.length > 0 ? discoverConnections(activities) : []), [activities]);
  const chapters = useMemo(() => (activities.length > 0 ? generateStoryChapters(activities) : []), [activities]);

  const activityMap = useMemo(() => {
    const map = new Map<string, LifeActivity>();
    for (const a of activities) map.set(a.id, a);
    return map;
  }, [activities]);

  const selectedActivity = selectedActivityId ? activityMap.get(selectedActivityId) ?? null : null;

  const handleSelectActivity = useCallback((id: string) => {
    setSelectedActivityId(prev => (prev === id ? null : id));
  }, []);

  const handleClosePanel = useCallback(() => {
    setSelectedActivityId(null);
  }, []);

  const handleExploreRecords = useCallback((activityIds: string[]) => {
    if (activityIds.length > 0) {
      setSelectedActivityId(activityIds[0]);
      navigateTo('archive');
    }
  }, [navigateTo]);

  const handleSelectMonth = useCallback((_month: string) => {
    navigateTo('archive');
  }, [navigateTo]);

  const handleImportActivities = useCallback((newActivities: LifeActivity[]) => {
    setActivities(prev => {
      const merged = [...newActivities, ...prev];
      setStats(computeStats(merged));
      return merged;
    });
  }, []);

  // Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setShowShortcuts(prev => !prev);
      } else if (e.key === 'Escape') {
        setShowShortcuts(false);
        setShowImport(false);
        setShowExport(false);
        setSelectedActivityId(null);
      } else if (e.key === '1') {
        navigateTo('insights');
      } else if (e.key === '2') {
        navigateTo('gallery');
      } else if (e.key === '3') {
        navigateTo('archive');
      } else if (e.key === '4') {
        navigateTo('connections');
      } else if (e.key === '5') {
        navigateTo('stories');
      } else if (e.key === '6') {
        navigateTo('journey');
      } else if (e.key === '/') {
        e.preventDefault();
        navigateTo('archive');
        const searchInput = document.querySelector('input[aria-label="Search archive records"]') as HTMLInputElement | null;
        searchInput?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigateTo]);

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center p-6 relative overflow-hidden">
        <AnimatedBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4 relative z-10"
        >
          <Loader2 className="w-12 h-12 text-amber animate-spin mx-auto" />
          <p className="font-serif text-3xl sm:text-5xl text-ivory tracking-[0.25em]">LIFE / RECEIPTS</p>
          <p className="text-ivory-muted text-sm sm:text-base md:text-lg">Synthesizing multi-modal digital activity stream...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-midnight text-ivory overflow-x-hidden selection:bg-amber/30 selection:text-ivory relative">
      {/* Dynamic Animated Ambient Background */}
      <AnimatedBackground />

      {/* Navigation - Edge to Edge */}
      <Navigation
        activeSection={activeSection}
        onNavigate={navigateTo}
        onOpenImport={() => setShowImport(true)}
        onOpenExport={() => setShowExport(true)}
        onOpenShortcuts={() => setShowShortcuts(true)}
      />

      {/* Main Content Sections wrapped in ErrorBoundary */}
      <ErrorBoundary>
        <main className="w-full relative z-10">
          <section id="section-hero" className="w-full">
            <HeroSection stats={stats} onNavigate={navigateTo} />
          </section>

          <section id="section-insights" className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-16 sm:py-24 border-t border-border/40">
            <InsightDashboard stats={stats} activities={activities} />
          </section>

          <section id="section-gallery" className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-16 sm:py-24 border-t border-border/40">
            <MemoryWallSection />
          </section>

          <section id="section-archive" className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-16 sm:py-24 border-t border-border/40">
            <ArchiveExplorer
              activities={activities}
              connections={connections}
              onSelectActivity={handleSelectActivity}
              selectedActivityId={selectedActivityId}
              onOpenImport={() => setShowImport(true)}
              onOpenExport={() => setShowExport(true)}
            />
          </section>

          <section id="section-connections" className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-16 sm:py-24 border-t border-border/40">
            <ConnectionExplorer connections={connections} activities={activities} />
          </section>

          <section id="section-stories" className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-16 sm:py-24 border-t border-border/40">
            <StorySection chapters={chapters} onExplore={handleExploreRecords} />
          </section>

          <section id="section-journey" className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-16 sm:py-24 border-t border-border/40">
            <JourneyTimeline activities={activities} onSelectMonth={handleSelectMonth} />
          </section>
        </main>
      </ErrorBoundary>

      {/* Full-width Editorial Footer */}
      <footer className="w-full border-t border-border px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-12 sm:py-16 relative z-10 bg-midnight/60 backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1.5">
            <p className="font-serif text-2xl sm:text-3xl tracking-[0.2em] text-ivory">LIFE / RECEIPTS</p>
            <p className="text-sm sm:text-base text-ivory-muted">
              Your life leaves traces. Discover the story between them.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center md:items-end gap-3 sm:gap-8 text-sm text-ivory-muted font-mono">
            <div className="flex items-center gap-2 text-ivory-muted/90">
              <ShieldCheck size={18} className="text-amber" />
              <span>Privacy Enforced • Pure Client-Side Architecture</span>
            </div>
            <span className="bg-surface px-3 py-1 rounded-md border border-border/50 font-semibold text-ivory">
              {activities.length.toLocaleString()} total normalized records
            </span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/30 text-center text-xs sm:text-sm text-ivory-muted/60 leading-relaxed">
          Designed for high-fidelity digital life exploration. All relationship links are statistically derived co-occurrences without fictional biography or identity attribution.
        </div>
      </footer>

      {/* Slide-in Relationship Inspector Drawer */}
      <AnimatePresence>
        {selectedActivity && (
          <ConnectionPanel
            activity={selectedActivity}
            connections={connections}
            allActivities={activities}
            onSelectActivity={handleSelectActivity}
            onClose={handleClosePanel}
          />
        )}
      </AnimatePresence>

      {/* Interactive Modals */}
      <KeyboardShortcutsModal
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />

      <DataImportModal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        onImport={handleImportActivities}
      />

      <DataExportModal
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        activities={activities}
        chapters={chapters}
      />
    </div>
  );
}
