import { motion } from 'motion/react';
import { ArrowDown, Sparkles, Music, CreditCard, ShoppingBag, Database, Network, ShieldCheck, FileSpreadsheet, Cpu } from 'lucide-react';
import { DepthText } from '@/components/ui/DepthText';
import { EchoText } from '@/components/ui/EchoText';
import { LogoLoop, type LogoItem } from '@/components/ui/LogoLoop';
import type { DataStats, ActiveSection } from '@/types';

interface HeroSectionProps {
  stats: DataStats;
  onNavigate: (section: ActiveSection) => void;
}

const ecosystemLogos: LogoItem[] = [
  {
    node: (
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface/80 border border-purple-500/40 text-xs sm:text-sm font-medium text-purple-300 shadow-sm backdrop-blur-sm">
        <Music size={15} className="text-music" />
        <span>Spotify Web Audio History</span>
      </div>
    ),
    title: 'Spotify History Stream'
  },
  {
    node: (
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface/80 border border-blue-500/40 text-xs sm:text-sm font-medium text-blue-300 shadow-sm backdrop-blur-sm">
        <CreditCard size={15} className="text-banking" />
        <span>India Banking & UPI Ledger</span>
      </div>
    ),
    title: 'India Banking & UPI'
  },
  {
    node: (
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface/80 border border-amber-500/40 text-xs sm:text-sm font-medium text-amber-300 shadow-sm backdrop-blur-sm">
        <ShoppingBag size={15} className="text-household" />
        <span>Daily Household Expenses</span>
      </div>
    ),
    title: 'Household Ledger'
  },
  {
    node: (
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface/80 border border-emerald-500/40 text-xs sm:text-sm font-medium text-emerald-300 shadow-sm backdrop-blur-sm">
        <ShieldCheck size={15} className="text-emerald-400" />
        <span>Privacy-Masked Tokens</span>
      </div>
    ),
    title: 'Deterministic Privacy Masking'
  },
  {
    node: (
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface/80 border border-cyan-500/40 text-xs sm:text-sm font-medium text-cyan-300 shadow-sm backdrop-blur-sm">
        <Database size={15} className="text-cyan-400" />
        <span>Kaggle Multi-Modal Datasets</span>
      </div>
    ),
    title: 'Kaggle Open Data'
  },
  {
    node: (
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface/80 border border-amber-400/40 text-xs sm:text-sm font-medium text-amber-200 shadow-sm backdrop-blur-sm">
        <Network size={15} className="text-amber" />
        <span>Heuristic Co-Occurrence Core</span>
      </div>
    ),
    title: 'Heuristic Engine'
  },
  {
    node: (
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface/80 border border-indigo-500/40 text-xs sm:text-sm font-medium text-indigo-300 shadow-sm backdrop-blur-sm">
        <FileSpreadsheet size={15} className="text-indigo-400" />
        <span>PapaParse Stream Loader</span>
      </div>
    ),
    title: 'Stream Loader'
  },
  {
    node: (
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface/80 border border-pink-500/40 text-xs sm:text-sm font-medium text-pink-300 shadow-sm backdrop-blur-sm">
        <Cpu size={15} className="text-pink-400" />
        <span>Autonomous Story Synthesis</span>
      </div>
    ),
    title: 'Narrative Engine'
  }
];


export function HeroSection({ stats, onNavigate }: HeroSectionProps) {
  return (
    <div className="relative min-h-[95vh] w-full flex items-center justify-center overflow-hidden pt-20 pb-16 sm:pb-24 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-midnight via-charcoal/40 to-midnight pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[340px] sm:w-[650px] md:w-[900px] h-[340px] sm:h-[650px] md:h-[900px] bg-amber/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full text-center">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-amber text-sm sm:text-base md:text-lg font-semibold tracking-[0.3em] uppercase mb-4 sm:mb-8"
        >
          Life / Receipts
        </motion.p>

        {/* 3D Layered Editorial Heading with DepthText */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mb-8 sm:mb-12 font-serif select-none"
        >
          <div className="flex flex-col items-center justify-center gap-1 sm:gap-3 w-full">
            <div className="w-full flex justify-center">
              <EchoText
                text="Every moment leaves"
                fontSize="clamp(3.2rem, 9.5vw, 8rem)"
                fontWeight={700}
                color="#f5f0e8"
                tint="#e8a849"
                direction="diagonal"
                echoes={10}
                offset={28}
                lag={0.22}
                fade={0.72}
                blur={2.5}
                className="font-serif tracking-tight select-none"
              />
            </div>
            <DepthText
              text="a receipt."
              layers={32}
              depth={3.0}
              faceColor="#f5f0e8"
              depthColor="#e8a849"
              tilt={9}
              pointerTracking={true}
              autoOrbit={true}
              orbitSpeed={0.3}
              fontSize="clamp(3.5rem, 11vw, 8.5rem)"
              fontWeight={700}
              className="font-serif tracking-tight"
            />
          </div>
        </motion.div>



        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="text-ivory-muted text-base sm:text-xl md:text-2xl lg:text-3xl max-w-4xl mx-auto mb-8 sm:mb-12 px-4 leading-relaxed font-light"
        >
          Listen closer. Look deeper. Discover the patterns hidden in everyday moments.
        </motion.p>

        {/* Stats pills - Enlarged */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-10 sm:mb-14 w-full max-w-5xl mx-auto"
        >
          <div className="px-5 py-3 rounded-xl bg-surface/70 border border-border/80 text-sm sm:text-base md:text-lg text-ivory-muted shadow-sm">
            <span className="text-ivory font-bold">{stats.totalActivities.toLocaleString()}</span> activities
          </div>
          <div className="px-5 py-3 rounded-xl bg-surface/70 border border-border/80 text-sm sm:text-base md:text-lg text-ivory-muted shadow-sm">
            <span className="text-music font-bold">{stats.sources.music.toLocaleString()}</span> music tracks
          </div>
          <div className="px-5 py-3 rounded-xl bg-surface/70 border border-border/80 text-sm sm:text-base md:text-lg text-ivory-muted shadow-sm">
            <span className="text-banking font-bold">{stats.sources.banking.toLocaleString()}</span> bank transactions
          </div>
          <div className="px-5 py-3 rounded-xl bg-surface/70 border border-border/80 text-sm sm:text-base md:text-lg text-ivory-muted shadow-sm">
            <span className="text-household font-bold">{stats.sources.household.toLocaleString()}</span> household records
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 max-w-md sm:max-w-none mx-auto mb-12 sm:mb-16"
        >
          <button
            onClick={() => onNavigate('archive')}
            className="px-8 py-4 bg-ivory text-midnight font-semibold text-base sm:text-lg rounded-xl hover:bg-ivory/90 transition-all flex items-center justify-center gap-2.5 shadow-md active:scale-98 cursor-pointer"
          >
            <ArrowDown size={20} />
            <span>Explore the archive</span>
          </button>
          <button
            onClick={() => onNavigate('connections')}
            className="px-8 py-4 border border-border/90 bg-surface/40 text-ivory font-semibold text-base sm:text-lg rounded-xl hover:bg-surface transition-all flex items-center justify-center gap-2.5 active:scale-98 cursor-pointer"
          >
            <Sparkles size={20} className="text-amber" />
            <span>Discover patterns</span>
          </button>
        </motion.div>

        {/* Multi-modal Ecosystem Continuous LogoLoop Marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="w-full max-w-6xl mx-auto pt-4 pb-2 border-t border-border/30"
        >
          <p className="text-xs sm:text-sm font-mono text-ivory-muted/60 uppercase tracking-widest mb-4">
            Unified Multi-Modal Ingestion & Intelligence Ecosystem
          </p>
          <LogoLoop
            logos={ecosystemLogos}
            speed={60}
            direction="left"
            logoHeight={36}
            gap={28}
            pauseOnHover={true}
            fadeOut={true}
            scaleOnHover={true}
          />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="hidden md:block pt-8 text-center pointer-events-none"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block"
          >
            <ArrowDown size={22} className="text-ivory-muted/40" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
