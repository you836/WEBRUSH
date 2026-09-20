import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Upload, Download, HelpCircle } from 'lucide-react';
import { RubberSegment, type RubberSegmentItem } from '@/components/ui/RubberSegment';
import type { ActiveSection } from '@/types';

const NAV_ITEMS: { id: ActiveSection; label: string }[] = [
  { id: 'insights', label: 'Overview' },
  { id: 'gallery', label: 'Memory Wall' },
  { id: 'archive', label: 'Archive' },
  { id: 'connections', label: 'Connections' },
  { id: 'stories', label: 'Stories' },
  { id: 'journey', label: 'Journey' },
];

const RUBBER_NAV_ITEMS: RubberSegmentItem[] = NAV_ITEMS.map(item => ({
  value: item.id,
  label: item.label
}));

interface NavigationProps {
  activeSection: ActiveSection;
  onNavigate: (section: ActiveSection) => void;
  onOpenImport?: () => void;
  onOpenExport?: () => void;
  onOpenShortcuts?: () => void;
}

export function Navigation({
  activeSection,
  onNavigate,
  onOpenImport,
  onOpenExport,
  onOpenShortcuts,
}: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on escape key or resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-40 glass border-b border-border/70 backdrop-blur-md"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <button
              onClick={() => onNavigate('hero')}
              className="font-serif text-lg sm:text-2xl tracking-[0.2em] sm:tracking-[0.25em] text-ivory hover:text-amber transition-colors flex items-center gap-2 text-left cursor-pointer"
            >
              <span>LIFE / RECEIPTS</span>
            </button>

            {/* Desktop RubberSegment Nav & Action Utilities */}
            <div className="hidden md:flex items-center gap-3">
              <RubberSegment
                items={RUBBER_NAV_ITEMS}
                value={activeSection !== 'hero' ? activeSection : undefined}
                onChange={(val) => onNavigate(val as ActiveSection)}
                trackColor="rgba(245, 240, 232, 0.07)"
                thumbColor="#e8a849"
                textColor="#a8a29e"
                activeTextColor="#0a0806"
                size="md"
                radius={12}
                stretch={110}
                squash={4}
                speed={1.1}
                equalSlots={false}
                draggable={true}
                className="border border-border/50 shadow-inner"
              />

              {/* Utility actions */}
              <div className="flex items-center gap-1.5 pl-2 border-l border-border/60 font-mono text-xs">
                {onOpenImport && (
                  <button
                    onClick={onOpenImport}
                    title="Import custom CSV/JSON life dataset"
                    className="p-2 rounded-lg bg-surface hover:bg-surface-light border border-border/60 text-ivory-muted hover:text-ivory transition-colors flex items-center gap-1.5"
                  >
                    <Upload size={14} className="text-amber" />
                    <span className="hidden xl:inline">Import</span>
                  </button>
                )}
                {onOpenExport && (
                  <button
                    onClick={onOpenExport}
                    title="Export synthesized story and telemetry data"
                    className="p-2 rounded-lg bg-surface hover:bg-surface-light border border-border/60 text-ivory-muted hover:text-ivory transition-colors flex items-center gap-1.5"
                  >
                    <Download size={14} className="text-amber" />
                    <span className="hidden xl:inline">Export</span>
                  </button>
                )}
                {onOpenShortcuts && (
                  <button
                    onClick={onOpenShortcuts}
                    title="Keyboard shortcuts (?)"
                    className="p-2 rounded-lg bg-surface hover:bg-surface-light border border-border/60 text-ivory-muted hover:text-ivory transition-colors"
                  >
                    <HelpCircle size={15} />
                  </button>
                )}
              </div>
            </div>


            {/* Mobile menu button */}
            <button
              className="md:hidden p-2.5 text-ivory-muted hover:text-ivory rounded-lg hover:bg-surface transition-colors active:scale-95"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-border bg-charcoal/95 backdrop-blur-md px-6 py-4 space-y-2 max-h-[calc(100vh-5rem)] overflow-y-auto"
            >
              {NAV_ITEMS.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-base transition-colors ${
                    activeSection === item.id
                      ? 'text-ivory bg-surface-light font-semibold'
                      : 'text-ivory-muted hover:text-ivory hover:bg-surface'
                  }`}
                >
                  <span>{item.label}</span>
                  {activeSection === item.id && (
                    <span className="w-2 h-2 rounded-full bg-amber" />
                  )}
                </button>
              ))}

              <div className="pt-3 border-t border-border/60 grid grid-cols-3 gap-2">
                {onOpenImport && (
                  <button
                    onClick={() => {
                      onOpenImport();
                      setMobileOpen(false);
                    }}
                    className="p-2.5 rounded-lg bg-surface hover:bg-surface-light border border-border/60 text-xs font-mono text-ivory flex flex-col items-center gap-1"
                  >
                    <Upload size={16} className="text-amber" />
                    <span>Import</span>
                  </button>
                )}
                {onOpenExport && (
                  <button
                    onClick={() => {
                      onOpenExport();
                      setMobileOpen(false);
                    }}
                    className="p-2.5 rounded-lg bg-surface hover:bg-surface-light border border-border/60 text-xs font-mono text-ivory flex flex-col items-center gap-1"
                  >
                    <Download size={16} className="text-amber" />
                    <span>Export</span>
                  </button>
                )}
                {onOpenShortcuts && (
                  <button
                    onClick={() => {
                      onOpenShortcuts();
                      setMobileOpen(false);
                    }}
                    className="p-2.5 rounded-lg bg-surface hover:bg-surface-light border border-border/60 text-xs font-mono text-ivory flex flex-col items-center gap-1"
                  >
                    <HelpCircle size={16} />
                    <span>Keys</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Backdrop overlay for mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-30 bg-midnight/70 backdrop-blur-xs md:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </>
  );
}
