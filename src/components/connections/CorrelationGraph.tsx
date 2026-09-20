import { useRef, useEffect, useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Network } from 'lucide-react';
import type { Connection, LifeActivity, LifeSource } from '@/types';

interface CorrelationGraphProps {
  connections: Connection[];
  activities: LifeActivity[];
}

interface GraphNode {
  id: string;
  label: string;
  source: LifeSource;
  x: number;
  y: number;
  radius: number;
  connectionsCount: number;
}

interface GraphLink {
  sourceId: string;
  targetId: string;
  reason: string;
  strength: number;
}

const SOURCE_COLORS: Record<LifeSource, string> = {
  music: '#1DB954',
  banking: '#e8a849',
  household: '#a78bfa',
};

export function CorrelationGraph({ connections, activities }: CorrelationGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [filterSource, setFilterSource] = useState<LifeSource | 'all'>('all');

  const { nodes, links } = useMemo(() => {
    const connectedActIds = new Set<string>();
    for (const c of connections.slice(0, 30)) {
      for (const id of c.activities) {
        connectedActIds.add(id);
      }
    }

    const activityMap = new Map(activities.map(a => [a.id, a]));
    const graphNodes: GraphNode[] = [];
    const idToIndex = new Map<string, number>();

    const selectedIds = Array.from(connectedActIds).slice(0, 28);
    const width = 800;
    const height = 450;

    selectedIds.forEach((id, idx) => {
      const act = activityMap.get(id);
      if (!act) return;

      const angle = (idx / selectedIds.length) * Math.PI * 2;
      const dist = 140 + (idx % 3) * 45;

      const jitterX = ((idx * 37) % 20) - 10;
      const jitterY = ((idx * 53) % 20) - 10;

      idToIndex.set(id, graphNodes.length);
      graphNodes.push({
        id: act.id,
        label: act.title,
        source: act.source,
        x: width / 2 + Math.cos(angle) * dist + jitterX,
        y: height / 2 + Math.sin(angle) * dist + jitterY,
        radius: act.source === 'banking' ? 9 : act.source === 'music' ? 8 : 7,
        connectionsCount: 0,
      });
    });

    const graphLinks: GraphLink[] = [];
    for (const c of connections.slice(0, 30)) {
      for (let i = 0; i < c.activities.length - 1; i++) {
        const srcId = c.activities[i];
        const tgtId = c.activities[i + 1];
        if (idToIndex.has(srcId) && idToIndex.has(tgtId)) {
          graphLinks.push({
            sourceId: srcId,
            targetId: tgtId,
            reason: c.reason,
            strength: c.strength,
          });
          const srcNode = graphNodes[idToIndex.get(srcId)!];
          const tgtNode = graphNodes[idToIndex.get(tgtId)!];
          if (srcNode) srcNode.connectionsCount++;
          if (tgtNode) tgtNode.connectionsCount++;
        }
      }
    }

    return { nodes: graphNodes, links: graphLinks };
  }, [connections, activities]);

  // Animated canvas simulation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let iteration = 0;

    const width = 800;
    const height = 450;

    const render = () => {
      iteration++;
      ctx.clearRect(0, 0, width, height);

      // Simple repulsion/spring relaxation for organic layout
      if (iteration < 60) {
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[j].x - nodes[i].x;
            const dy = nodes[j].y - nodes[i].y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            if (dist < 90) {
              const force = ((90 - dist) / dist) * 0.05;
              nodes[i].x -= dx * force;
              nodes[i].y -= dy * force;
              nodes[j].x += dx * force;
              nodes[j].y += dy * force;
            }
          }
        }
      }

      // Draw links
      for (const link of links) {
        const src = nodes.find(n => n.id === link.sourceId);
        const tgt = nodes.find(n => n.id === link.targetId);
        if (!src || !tgt) continue;

        if (filterSource !== 'all' && src.source !== filterSource && tgt.source !== filterSource) {
          continue;
        }

        const isHighlighted = hoveredNode && (hoveredNode.id === src.id || hoveredNode.id === tgt.id);

        ctx.beginPath();
        ctx.moveTo(src.x, src.y);
        ctx.lineTo(tgt.x, tgt.y);
        ctx.strokeStyle = isHighlighted
          ? 'rgba(232, 168, 73, 0.85)'
          : 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = isHighlighted ? 2.5 : Math.max(1, link.strength * 2);
        ctx.stroke();
      }

      // Draw nodes
      for (const node of nodes) {
        if (filterSource !== 'all' && node.source !== filterSource) {
          continue;
        }

        const isHovered = hoveredNode?.id === node.id;
        const color = SOURCE_COLORS[node.source] || '#e8a849';

        // Outer glow on hover
        if (isHovered) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 8, 0, Math.PI * 2);
          ctx.fillStyle = `${color}33`;
          ctx.fill();
        }

        // Main node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + (isHovered ? 3 : 0), 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#0e1117';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Node label
        if (isHovered || node.connectionsCount > 2) {
          ctx.font = isHovered ? 'bold 12px monospace' : '10px monospace';
          ctx.fillStyle = isHovered ? '#f5f0e8' : 'rgba(245, 240, 232, 0.6)';
          ctx.textAlign = 'center';
          const truncated = node.label.length > 18 ? node.label.slice(0, 16) + '…' : node.label;
          ctx.fillText(truncated, node.x, node.y - node.radius - 6);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [nodes, links, hoveredNode, filterSource]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = 800 / rect.width;
    const scaleY = 450 / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;

    let found: GraphNode | null = null;
    for (const node of nodes) {
      const dx = node.x - mx;
      const dy = node.y - my;
      if (Math.sqrt(dx * dx + dy * dy) <= node.radius + 10) {
        found = node;
        break;
      }
    }
    setHoveredNode(found);
  };

  return (
    <div className="bg-charcoal/90 border border-border/80 rounded-2xl p-6 space-y-5 backdrop-blur-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber text-xs font-semibold uppercase tracking-wider mb-1">
            <Network size={16} />
            <span>Interactive Correlation Topology Map</span>
          </div>
          <p className="text-xs sm:text-sm text-ivory-muted">
            Hover over vertices to inspect relational affinity links across music, banking, and expense streams.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <div className="flex items-center bg-surface border border-border/60 rounded-lg p-1">
            <button
              onClick={() => setFilterSource('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${filterSource === 'all' ? 'bg-amber text-midnight font-bold' : 'text-ivory-muted hover:text-ivory'}`}
            >
              All Sources
            </button>
            <button
              onClick={() => setFilterSource('music')}
              className={`px-2.5 py-1 rounded-md transition-colors ${filterSource === 'music' ? 'bg-[#1DB954] text-midnight font-bold' : 'text-ivory-muted hover:text-ivory'}`}
            >
              Music
            </button>
            <button
              onClick={() => setFilterSource('banking')}
              className={`px-2.5 py-1 rounded-md transition-colors ${filterSource === 'banking' ? 'bg-amber text-midnight font-bold' : 'text-ivory-muted hover:text-ivory'}`}
            >
              Banking
            </button>
            <button
              onClick={() => setFilterSource('household')}
              className={`px-2.5 py-1 rounded-md transition-colors ${filterSource === 'household' ? 'bg-[#a78bfa] text-midnight font-bold' : 'text-ivory-muted hover:text-ivory'}`}
            >
              Expenses
            </button>
          </div>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative w-full aspect-[16/9] bg-midnight/70 rounded-xl border border-border/60 overflow-hidden shadow-inner flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={800}
          height={450}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredNode(null)}
          className="w-full h-full object-contain cursor-crosshair"
        />

        {/* Legend */}
        <div className="absolute bottom-3 left-3 bg-charcoal/90 backdrop-blur-md px-3 py-2 rounded-lg border border-border/50 text-[11px] font-mono flex items-center gap-4 text-ivory-muted">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1DB954]" />
            <span>Spotify</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber" />
            <span>Banking</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#a78bfa]" />
            <span>Household</span>
          </div>
        </div>

        {/* Hovered Node Detail Tooltip */}
        {hoveredNode && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-3 right-3 bg-charcoal/95 border border-amber/50 rounded-xl p-3 max-w-[280px] shadow-xl backdrop-blur-md pointer-events-none"
          >
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: SOURCE_COLORS[hoveredNode.source] }}
              />
              <span className="text-xs font-bold text-amber uppercase tracking-wider">
                {hoveredNode.source} Record
              </span>
            </div>
            <p className="text-xs font-medium text-ivory line-clamp-2">{hoveredNode.label}</p>
            <p className="text-[11px] text-ivory-muted font-mono mt-1">
              {hoveredNode.connectionsCount} Correlated Link{hoveredNode.connectionsCount !== 1 ? 's' : ''}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
