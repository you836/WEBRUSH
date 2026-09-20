import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Keyboard, X, Command } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUT_GROUPS = [
  {
    title: 'Navigation & Sections',
    shortcuts: [
      { key: '1', description: 'Jump to Hero Section' },
      { key: '2', description: 'Jump to Insights & Analytics' },
      { key: '3', description: 'Jump to Memory Drift Wall' },
      { key: '4', description: 'Jump to Multi-Facet Archive' },
      { key: '5', description: 'Jump to Connections Explorer' },
      { key: '6', description: 'Jump to Story Chapters' },
      { key: '7', description: 'Jump to Interactive Journey' },
    ],
  },
  {
    title: 'Quick Actions & Controls',
    shortcuts: [
      { key: '/', description: 'Quick focus search in Archive' },
      { key: 'Esc', description: 'Close active drawer / modal' },
      { key: '?', description: 'Toggle this Shortcuts Guide' },
    ],
  },
];

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="shortcuts-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
        >
          {/* Backdrop click */}
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-[#14120e] border border-amber/30 text-ivory shadow-2xl space-y-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5 text-amber">
                <div className="p-2 rounded-xl bg-amber/10 border border-amber/20">
                  <Keyboard size={20} />
                </div>
                <div>
                  <h2 id="shortcuts-title" className="font-serif text-xl sm:text-2xl font-bold text-ivory">
                    Keyboard Shortcuts HUD
                  </h2>
                  <p className="text-xs font-mono text-ivory-muted">Quick navigation & power actions</p>
                </div>
              </div>

              <button
                onClick={onClose}
                type="button"
                aria-label="Close shortcuts dialog"
                className="p-2 rounded-xl text-ivory-muted hover:text-ivory hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/10"
              >
                <X size={18} />
              </button>
            </div>

            {/* Shortcuts Content */}
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1">
              {SHORTCUT_GROUPS.map((group, i) => (
                <div key={i} className="space-y-2.5">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-amber font-semibold">
                    {group.title}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {group.shortcuts.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-charcoal/60 border border-white/5 text-xs text-ivory-muted"
                      >
                        <span className="truncate pr-2">{item.description}</span>
                        <kbd className="px-2.5 py-1 rounded-md bg-[#221f1a] border border-white/10 text-ivory font-mono font-bold text-[11px] shadow-sm shrink-0">
                          {item.key}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-ivory-muted">
              <div className="flex items-center gap-1.5">
                <Command size={13} className="text-amber" />
                <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-ivory">?</kbd> anywhere to toggle</span>
              </div>
              <button
                onClick={onClose}
                type="button"
                className="px-4 py-1.5 rounded-full bg-amber text-[#0a0806] font-semibold text-xs hover:bg-amber/90 transition-all cursor-pointer"
              >
                Got it
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default KeyboardShortcutsModal;
