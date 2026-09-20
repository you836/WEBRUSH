import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, FileJson, FileSpreadsheet, CheckCircle2, X } from 'lucide-react';
import type { LifeActivity, Connection, StoryChapter, DataStats } from '@/types';

interface DataExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  activities: LifeActivity[];
  connections: Connection[];
  chapters: StoryChapter[];
  stats: DataStats | null;
}

export function DataExportModal({ isOpen, onClose, activities, connections, chapters, stats }: DataExportModalProps) {
  const [downloadedFormat, setDownloadedFormat] = useState<string | null>(null);

  const exportJSON = () => {
    const payload = {
      meta: {
        title: 'LIFE / RECEIPTS • Digital Archive Export',
        exportedAt: new Date().toISOString(),
        version: '1.0.0',
        stats,
      },
      stories: chapters,
      connections,
      activities,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `life-receipts-archive-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadedFormat('JSON');
  };

  const exportCSV = () => {
    // Generate CSV for activities
    const headers = ['id', 'source', 'timestamp', 'title', 'category', 'amount', 'currency', 'tags'];
    const rows = activities.map(act => [
      act.id,
      act.source,
      act.timestamp,
      `"${(act.title || '').replace(/"/g, '""')}"`,
      act.category || '',
      act.amount ?? 0,
      act.currency || '',
      `"${act.tags.join('; ')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `life-receipts-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadedFormat('CSV');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="export-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#14120e] border border-amber/30 text-ivory shadow-2xl space-y-6"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5 text-amber">
                <div className="p-2 rounded-xl bg-amber/10 border border-amber/20">
                  <Download size={20} />
                </div>
                <div>
                  <h2 id="export-title" className="font-serif text-xl sm:text-2xl font-bold text-ivory">
                    Export Digital Archive
                  </h2>
                  <p className="text-xs font-mono text-ivory-muted">Full multi-modal data portability</p>
                </div>
              </div>

              <button
                onClick={onClose}
                type="button"
                aria-label="Close export dialog"
                className="p-2 rounded-xl text-ivory-muted hover:text-ivory hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/10"
              >
                <X size={18} />
              </button>
            </div>

            {/* Summary Box */}
            <div className="p-4 rounded-2xl bg-charcoal/60 border border-white/5 space-y-2 text-xs font-mono text-ivory-muted">
              <div className="flex justify-between">
                <span>Total Life Activities:</span>
                <span className="text-ivory font-bold">{activities.length} records</span>
              </div>
              <div className="flex justify-between">
                <span>Discovered Cross-Source Links:</span>
                <span className="text-amber font-bold">{connections.length} relations</span>
              </div>
              <div className="flex justify-between">
                <span>Synthesized Story Chapters:</span>
                <span className="text-purple-400 font-bold">{chapters.length} chapters</span>
              </div>
            </div>

            {/* Format Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={exportJSON}
                type="button"
                className="p-4 rounded-2xl bg-surface border border-white/10 hover:border-amber/50 hover:bg-charcoal transition-all text-left space-y-2 cursor-pointer group"
              >
                <div className="p-2 rounded-xl bg-amber/10 text-amber w-fit border border-amber/20 group-hover:scale-105 transition-transform">
                  <FileJson size={22} />
                </div>
                <div>
                  <h4 className="font-semibold text-ivory text-sm">Comprehensive JSON</h4>
                  <p className="text-[11px] text-ivory-muted leading-relaxed">
                    Includes all story chapters, cross-source links, and full activity schemas.
                  </p>
                </div>
              </button>

              <button
                onClick={exportCSV}
                type="button"
                className="p-4 rounded-2xl bg-surface border border-white/10 hover:border-blue-400/50 hover:bg-charcoal transition-all text-left space-y-2 cursor-pointer group"
              >
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 w-fit border border-blue-500/20 group-hover:scale-105 transition-transform">
                  <FileSpreadsheet size={22} />
                </div>
                <div>
                  <h4 className="font-semibold text-ivory text-sm">Ledger CSV</h4>
                  <p className="text-[11px] text-ivory-muted leading-relaxed">
                    Tabular spreadsheet format with timestamps, categories, and spendings.
                  </p>
                </div>
              </button>
            </div>

            {downloadedFormat && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>Exported {downloadedFormat} file generated and saved successfully!</span>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default DataExportModal;
