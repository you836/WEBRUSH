import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Eye, Layers, Compass } from 'lucide-react';
import { DriftWall, type DriftWallItem } from '@/components/ui/DriftWall';
import { EchoText } from '@/components/ui/EchoText';

// Comprehensive high-res imagery representing all multi-modal life receipts:
// Spotify albums, UPI payments, coffee shops, grocery markets, concerts, transit, bookstore, late-night coding
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
  },
  {
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
    title: 'Vintage Analog Cassette Decks',
    category: 'Music'
  },
  {
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    title: 'Acoustic Studio & Recording Sessions',
    category: 'Music'
  },
  {
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop&q=80',
    title: 'Record Store Vinyl Hunting',
    category: 'Music'
  },
  {
    image: 'https://images.unsplash.com/photo-1556742208-999815fca738?w=600&auto=format&fit=crop&q=80',
    title: 'High-Street Retail Checkout Counter',
    category: 'Banking'
  },
  {
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80',
    title: 'Specialty Brew & Morning Routine',
    category: 'Household'
  },
  {
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&auto=format&fit=crop&q=80',
    title: 'Weekend Farmers Market & Fresh Fruit',
    category: 'Household'
  },
  {
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&auto=format&fit=crop&q=80',
    title: 'Urban Metro Travel & Transit Card',
    category: 'Household'
  },
  {
    image: 'https://images.unsplash.com/photo-1507842229451-7f01be802805?w=600&auto=format&fit=crop&q=80',
    title: 'Cozy Weekend Bookstore Reading',
    category: 'Household'
  },
  {
    image: 'https://images.unsplash.com/photo-1517840905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
    title: 'Rainy Day Artisanal Tea & Warmth',
    category: 'Household'
  },
  {
    image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=600&auto=format&fit=crop&q=80',
    title: 'Digital Cryptographic Receipts',
    category: 'Banking'
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
            Glide your pointer over the 3D memory plane to explore every single floating multi-modal artifact — audio streams, UPI payments, coffee visits, and daily life textures.
          </p>
        </div>

        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-surface/80 border border-border/80 text-xs sm:text-sm font-mono text-ivory-muted">
          <Eye size={16} className="text-amber" />
          <span>Move pointer to tilt & drift</span>
        </div>
      </motion.div>

      {/* 3D Isometric DriftWall Container */}
      <div className="w-full h-[540px] sm:h-[620px] lg:h-[700px] bg-charcoal/90 backdrop-blur-md rounded-3xl border border-border/80 shadow-2xl relative overflow-hidden">
        {/* Ambient radial lighting glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />

        {/* DriftWall Foreground */}
        <div className="relative z-10 w-full h-full">
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
            speed={36}
            variance={0.4}
            parallax={0.7}
            lift={72}
            fade={0.3}
            dim={0.15}
            pauseOnHover={true}
            overlayColor="#0a0806"
            className="h-full w-full"
          />
        </div>

        {/* Subtle bottom badge */}
        <div className="absolute bottom-4 left-6 z-20 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121110]/85 backdrop-blur-md border border-white/10 text-xs font-mono text-ivory-muted shadow-lg">
          <Compass size={13} className="text-amber" />
          <span>{MEMORY_WALL_ITEMS.length} Memory Receipts • Infinite 3D Drift Loop</span>
        </div>
      </div>
    </div>
  );
}

export default MemoryWallSection;
