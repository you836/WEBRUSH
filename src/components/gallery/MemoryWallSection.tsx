import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Eye, Layers } from 'lucide-react';
import { DriftWall, type DriftWallItem } from '@/components/ui/DriftWall';
import { EchoText } from '@/components/ui/EchoText';

// Curated high-res imagery representing the multi-modal life receipts:
// Music album arts, coffee shops, metro transit, grocery markets, restaurants, night coding, concerts
const MEMORY_WALL_ITEMS: DriftWallItem[] = [
  {
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    title: 'Late Night Live Concerts & Synths',
    category: 'Music'
  },
  {
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80',
    title: 'Midnight Streaming & Audio Beats',
    category: 'Music'
  },
  {
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
    title: 'UPI & Point-of-Sale Transactions',
    category: 'Banking'
  },
  {
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80',
    title: 'Daily Espresso & Cafe Workspace',
    category: 'Household'
  },
  {
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&auto=format&fit=crop&q=80',
    title: 'Banking Ledger & Digital Currency',
    category: 'Banking'
  },
  {
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
    title: 'Supermarket & Weekly Pantry Essentials',
    category: 'Household'
  },
  {
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    title: 'Electronic Vinyl Sessions & DJ Tracks',
    category: 'Music'
  },
  {
    image: 'https://images.unsplash.com/photo-1556742049-0a67e5572263?w=600&auto=format&fit=crop&q=80',
    title: 'Smart Card Terminal & Retail Tap',
    category: 'Banking'
  },
  {
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600&auto=format&fit=crop&q=80',
    title: 'Indie Band Tours & Festival Stalls',
    category: 'Music'
  },
  {
    image: 'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?w=600&auto=format&fit=crop&q=80',
    title: 'Urban Dining, Street Food & Quick Bites',
    category: 'Household'
  },
  {
    image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=600&auto=format&fit=crop&q=80',
    title: 'Online Subscriptions & Utility Receipts',
    category: 'Banking'
  },
  {
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=80',
    title: 'Department Stores & Lifestyle Retail',
    category: 'Household'
  },
  {
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80',
    title: 'Late-Night Deep Focus Work Sessions',
    category: 'Music'
  },
  {
    image: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=600&auto=format&fit=crop&q=80',
    title: 'Monthly Statement Reconciliation',
    category: 'Banking'
  },
  {
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
    title: 'Social Gatherings & Evening Dinners',
    category: 'Household'
  }
];

export function MemoryWallSection() {
  return (
    <div className="space-y-8 sm:space-y-12 w-full">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Layers size={18} className="text-amber" />
            <span className="text-sm font-semibold text-amber uppercase tracking-widest">
              3D Interactive Exhibition
            </span>
          </div>
          <div className="mb-3">
            <EchoText
              text="Memory Drift Wall"
              fontSize="clamp(2.5rem, 6vw, 4.5rem)"
              fontWeight={700}
              color="#f5f0e8"
              tint="#e8a849"
              direction="diagonal"
              echoes={8}
              offset={18}
              className="font-serif tracking-tight"
            />
          </div>
          <p className="text-sm sm:text-base md:text-lg text-ivory-muted mt-2 max-w-3xl leading-relaxed">
            Glide your pointer over the 3D memory plane to explore floating multi-modal artifacts — audio streams, card terminals, coffee receipts, and daily life textures.
          </p>
        </div>

        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-surface/80 border border-border/80 text-xs sm:text-sm font-mono text-ivory-muted">
          <Eye size={16} className="text-amber" />
          <span>Move mouse to tilt & parallax</span>
        </div>
      </motion.div>

      {/* 3D Isometric DriftWall Container */}
      <div className="w-full h-[520px] sm:h-[600px] lg:h-[680px] bg-charcoal/80 backdrop-blur-md rounded-3xl border border-border/80 shadow-2xl relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-amber/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        <DriftWall
          items={MEMORY_WALL_ITEMS}
          columns={5}
          tileWidth={230}
          tileHeight={150}
          gap={20}
          radius={16}
          tilt={18}
          turn={-16}
          perspective={1100}
          depth={140}
          speed={38}
          variance={0.4}
          parallax={0.7}
          lift={72}
          fade={0.65}
          dim={0.4}
          pauseOnHover={true}
          overlayColor="#0a0806"
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
