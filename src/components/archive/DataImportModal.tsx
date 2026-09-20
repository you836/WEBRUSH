import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, FileSpreadsheet, Music, CreditCard, ShoppingBag, CheckCircle2, AlertCircle, X, ShieldCheck } from 'lucide-react';
import Papa from 'papaparse';
import { normalizeSpotifyData, type SpotifyRecord } from '@/data/spotify';
import { normalizeBankingData, type BankingRecord } from '@/data/banking';
import { normalizeHouseholdData, type HouseholdRecord } from '@/data/household';
import type { LifeActivity, LifeSource } from '@/types';

interface DataImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportActivities: (newActivities: LifeActivity[]) => void;
}

export function DataImportModal({ isOpen, onClose, onImportActivities }: DataImportModalProps) {
  const [selectedSource, setSelectedSource] = useState<LifeSource>('music');
  const [parsing, setParsing] = useState(false);
  const [parsedCount, setParsedCount] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = useCallback((file: File) => {
    setParsing(true);
    setErrorMsg(null);
    setParsedCount(null);

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        if (!text) {
          setErrorMsg('File was empty or could not be read.');
          setParsing(false);
          return;
        }

        let activities: LifeActivity[] = [];

        // Check if JSON (e.g. Spotify extended streaming history)
        if (file.name.endsWith('.json')) {
          const json = JSON.parse(text);
          if (Array.isArray(json)) {
            // Map JSON array to Spotify records
            const records: SpotifyRecord[] = json.map((item: any) => ({
              spotify_track_uri: item.spotify_track_uri || `spotify:track:${item.trackName || 'unknown'}`,
              ts: item.ts || item.endTime || new Date().toISOString(),
              platform: item.platform || 'web',
              ms_played: String(item.ms_played || item.msPlayed || 180000),
              track_name: item.master_metadata_track_name || item.trackName || item.track_name || 'Unknown Track',
              artist_name: item.master_metadata_album_artist_name || item.artistName || item.artist_name || 'Unknown Artist',
              album_name: item.master_metadata_album_album_name || item.albumName || item.album_name || 'Unknown Album',
              reason_start: item.reason_start || 'trackdone',
              reason_end: item.reason_end || 'trackdone',
              shuffle: String(item.shuffle ?? false),
              skipped: String(item.skipped ?? false),
            }));
            activities = normalizeSpotifyData(records);
          }
        } else {
          // Parse CSV using PapaParse
          const parseResult = Papa.parse<any>(text, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: false,
          });

          if (selectedSource === 'music') {
            activities = normalizeSpotifyData(parseResult.data as SpotifyRecord[]);
          } else if (selectedSource === 'banking') {
            activities = normalizeBankingData(parseResult.data as BankingRecord[]);
          } else {
            activities = normalizeHouseholdData(parseResult.data as HouseholdRecord[]);
          }
        }

        if (activities.length === 0) {
          setErrorMsg('No valid records matched the expected schema for this category. Please verify columns.');
        } else {
          setParsedCount(activities.length);
          onImportActivities(activities);
        }
      } catch (err) {
        console.error('Data import failed:', err);
        setErrorMsg('Failed to parse file. Please verify CSV/JSON formatting.');
      } finally {
        setParsing(false);
      }
    };

    reader.readAsText(file);
  }, [selectedSource, onImportActivities]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="import-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-[#14120e] border border-amber/30 text-ivory shadow-2xl space-y-6"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5 text-amber">
                <div className="p-2 rounded-xl bg-amber/10 border border-amber/20">
                  <Upload size={20} />
                </div>
                <div>
                  <h2 id="import-title" className="font-serif text-xl sm:text-2xl font-bold text-ivory">
                    Import Custom Dataset
                  </h2>
                  <p className="text-xs font-mono text-ivory-muted">Client-side instant multi-modal synthesis</p>
                </div>
              </div>

              <button
                onClick={onClose}
                type="button"
                aria-label="Close import dialog"
                className="p-2 rounded-xl text-ivory-muted hover:text-ivory hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/10"
              >
                <X size={18} />
              </button>
            </div>

            {/* Source Category Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest text-ivory-muted block">
                Target Data Source
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'music' as LifeSource, label: 'Spotify Streams', icon: Music, color: 'text-purple-400' },
                  { id: 'banking' as LifeSource, label: 'UPI / Bank CSV', icon: CreditCard, color: 'text-blue-400' },
                  { id: 'household' as LifeSource, label: 'Expenses CSV', icon: ShoppingBag, color: 'text-amber-400' },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isSelected = selectedSource === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setSelectedSource(tab.id)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-xs font-medium transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber/15 border-amber text-ivory shadow-md shadow-amber/10'
                          : 'bg-charcoal/40 border-white/5 text-ivory-muted hover:text-ivory hover:bg-white/5'
                      }`}
                    >
                      <Icon size={18} className={tab.color} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Drag and Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`p-8 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center space-y-3 cursor-pointer ${
                dragOver
                  ? 'border-amber bg-amber/10 scale-[0.99]'
                  : 'border-white/15 bg-charcoal/40 hover:border-amber/50 hover:bg-charcoal/60'
              }`}
              onClick={() => document.getElementById('file-upload-input')?.click()}
            >
              <input
                id="file-upload-input"
                type="file"
                accept=".csv,.json"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
              <div className="p-3 rounded-full bg-amber/10 text-amber border border-amber/20">
                <FileSpreadsheet size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-ivory">
                  {parsing ? 'Parsing & Normalizing Dataset...' : 'Click or Drag CSV / JSON Here'}
                </p>
                <p className="text-xs text-ivory-muted/70 mt-1 font-mono">
                  Supports Spotify StreamingHistory.json/csv, UPI statements, or expense sheets
                </p>
              </div>
            </div>

            {/* Status alerts */}
            {parsedCount !== null && (
              <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
                <span>Successfully normalized & integrated <strong>{parsedCount}</strong> live records into your digital life stream!</span>
              </div>
            )}

            {errorMsg && (
              <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                <AlertCircle size={16} className="shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Privacy Guarantee Badge */}
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-black/40 border border-white/5 text-xs font-mono text-ivory-muted/80">
              <ShieldCheck size={16} className="text-amber shrink-0" />
              <span>100% Client-Side In-Browser Execution. Your private transactions & files never leave your device.</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default DataImportModal;
