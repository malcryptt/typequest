"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/game/store";
import { REGIONS } from "@/lib/game/regions";
import { Lock, Star, ChevronRight, X, Package, ShoppingBag, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

// Region config — positions on the map (% of container)
const REGION_POSITIONS: Record<string, { x: number; y: number; emoji: string; color: string }> = {
  "verdant-vale": { x: 20, y: 80, emoji: "🌲", color: "oklch(0.55 0.18 145)" },
  "misty-marshes": { x: 45, y: 65, emoji: "💧", color: "oklch(0.55 0.15 220)" },
  "frostpeak": { x: 25, y: 40, emoji: "❄️", color: "oklch(0.65 0.12 220)" },
  "sunfire-desert": { x: 65, y: 55, emoji: "🔥", color: "oklch(0.6 0.2 50)" },
  "neon-city": { x: 80, y: 35, emoji: "🏙️", color: "oklch(0.65 0.25 320)" },
  "storm-peaks": { x: 55, y: 20, emoji: "⚡", color: "oklch(0.6 0.2 260)" },
};

// Dotted path connections between region nodes (in order)
const PATHS = [
  ["verdant-vale", "misty-marshes"],
  ["misty-marshes", "frostpeak"],
  ["misty-marshes", "sunfire-desert"],
  ["sunfire-desert", "neon-city"],
  ["frostpeak", "storm-peaks"],
  ["neon-city", "storm-peaks"],
];

interface RegionNode {
  id: string;
  name: string;
  description: string;
  requiredLevel: number;
  levels: { id: string; name: string }[];
  environment: string;
}

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3].map(i => (
        <Star key={i} size={12} className={i <= count ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"} />
      ))}
    </div>
  );
}

function RegionDetailPanel({ region, onClose, onEnter }: {
  region: RegionNode; onClose: () => void; onEnter: () => void;
}) {
  const { regionProgress } = useGameStore();
  const progress = regionProgress[region.id];
  const completedCount = progress?.completedLevels?.length ?? 0;
  const totalLevels = region.levels.length;
  const completionPct = totalLevels > 0 ? Math.round((completedCount / totalLevels) * 100) : 0;
  const totalStars = Object.values(progress?.levelStars ?? {}).reduce((a, b) => a + b, 0);
  const maxStars = totalLevels * 3;
  const pos = REGION_POSITIONS[region.id];

  return (
    <motion.div className="absolute right-0 top-0 bottom-0 w-full sm:w-80 z-30 flex flex-col"
      initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ background: "oklch(0.12 0.04 280 / 0.95)", borderLeft: `1px solid ${pos?.color ?? "oklch(0.3 0.08 280)"}44`, backdropFilter: "blur(20px)" }}>
      {/* Header */}
      <div className="p-5 flex items-start justify-between"
        style={{ borderBottom: "1px solid oklch(0.22 0.05 280 / 0.5)" }}>
        <div>
          <div className="text-3xl mb-1">{pos?.emoji}</div>
          <h2 className="text-xl font-bold text-foreground">{region.name}</h2>
          <p className="text-sm text-muted-foreground mt-1">{region.description ?? "A mysterious region awaits."}</p>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors mt-1">
          <X size={20} />
        </button>
      </div>

      {/* Completion ring + stars */}
      <div className="flex items-center gap-4 px-5 py-4" style={{ borderBottom: "1px solid oklch(0.22 0.05 280 / 0.5)" }}>
        <div className="relative w-16 h-16 flex-shrink-0">
          <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
            <circle cx="32" cy="32" r="26" fill="none" stroke="oklch(0.22 0.05 280)" strokeWidth="6" />
            <motion.circle cx="32" cy="32" r="26" fill="none" strokeWidth="6"
              stroke={pos?.color ?? "oklch(0.55 0.18 280)"} strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: completionPct / 100 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ pathLength: completionPct / 100, strokeDasharray: "1", strokeDashoffset: "0" }} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-foreground">{completionPct}%</span>
          </div>
        </div>
        <div>
          <p className="text-sm text-foreground font-semibold">{completedCount}/{totalLevels} Stages</p>
          <div className="flex items-center gap-1 mt-1">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-muted-foreground">{totalStars}/{maxStars} Stars</span>
          </div>
        </div>
      </div>

      {/* Stage list */}
      <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2">
        {region.levels.slice(0, 10).map((level, i) => {
          const stars = progress?.levelStars?.[level.id] ?? 0;
          const completed = progress?.completedLevels?.includes(level.id) ?? false;
          return (
            <div key={level.id}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
              style={{ background: completed ? "oklch(0.16 0.05 280 / 0.6)" : "oklch(0.12 0.03 280 / 0.4)", border: "1px solid oklch(0.22 0.05 280 / 0.4)" }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: completed ? (pos?.color ?? "oklch(0.55 0.18 280)") : "oklch(0.18 0.04 280)", color: completed ? "#fff" : "oklch(0.5 0.05 280)" }}>
                {i + 1}
              </div>
              <p className="flex-1 text-sm text-foreground truncate">{level.name}</p>
              <StarRating count={stars} />
            </div>
          );
        })}
      </div>

      {/* Enter button */}
      <div className="p-5">
        <motion.button onClick={onEnter} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          className="w-full h-14 rounded-xl font-bold text-white flex items-center justify-center gap-2"
          style={{ background: `linear-gradient(135deg, ${pos?.color ?? "oklch(0.55 0.18 280)"}, oklch(0.4 0.12 280))`, boxShadow: `0 4px 24px ${pos?.color ?? "oklch(0.55 0.18 280)"}55` }}>
          Enter Region <ChevronRight size={20} />
        </motion.button>
      </div>
    </motion.div>
  );
}

export function WorldMapView() {
  const { player, regionProgress, setGameState, startCombat, currentLevel, selectRegion } = useGameStore();
  const [selectedRegion, setSelectedRegion] = useState<(typeof REGIONS)[0] | null>(null);

  if (!player) return null;

  const handleEnterRegion = () => {
    if (!selectedRegion) return;
    const firstUncompletedLevel = selectedRegion.levels.find(
      l => !regionProgress[selectedRegion.id]?.completedLevels?.includes(l.id)
    ) ?? selectedRegion.levels[0];
    if (firstUncompletedLevel) {
      selectRegion(selectedRegion.id);
      startCombat(firstUncompletedLevel.id);
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: "oklch(0.07 0.04 280)" }}>
      {/* Parchment map background */}
      <div className="absolute inset-0"
        style={{
          background: `
          radial-gradient(ellipse at 50% 40%, oklch(0.18 0.06 280 / 0.6) 0%, transparent 60%),
          radial-gradient(ellipse at 20% 70%, oklch(0.15 0.05 145 / 0.3) 0%, transparent 40%),
          radial-gradient(ellipse at 80% 20%, oklch(0.15 0.05 40 / 0.2) 0%, transparent 40%),
          oklch(0.09 0.04 280)
        ` }}>
        {/* Texture lines for parchment feel */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className="absolute w-full h-px opacity-5"
            style={{ top: `${10 + i * 12}%`, background: "linear-gradient(90deg, transparent, oklch(0.7 0.05 280), transparent)" }} />
        ))}
      </div>

      {/* SVG Paths between regions */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
        <defs>
          <marker id="dot" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3" markerHeight="3">
            <circle cx="5" cy="5" r="3" fill="oklch(0.45 0.08 280)" />
          </marker>
        </defs>
        {PATHS.map(([fromId, toId]) => {
          const from = REGION_POSITIONS[fromId];
          const to = REGION_POSITIONS[toId];
          if (!from || !to) return null;
          const fromUnlocked = regionProgress[fromId]?.unlocked ?? false;
          const toUnlocked = regionProgress[toId]?.unlocked ?? false;
          const isActive = fromUnlocked && toUnlocked;
          return (
            <line key={`${fromId}-${toId}`}
              x1={`${from.x}%`} y1={`${from.y}%`} x2={`${to.x}%`} y2={`${to.y}%`}
              stroke={isActive ? "oklch(0.55 0.15 280)" : "oklch(0.25 0.05 280)"}
              strokeWidth="2" strokeDasharray="6 4" opacity={isActive ? 0.7 : 0.3} />
          );
        })}
      </svg>

      {/* Region Nodes */}
      <div className="absolute inset-0" style={{ zIndex: 2 }}>
        {REGIONS.map((region) => {
          const pos = REGION_POSITIONS[region.id];
          if (!pos) return null;
          const progress = regionProgress[region.id];
          const unlocked = progress?.unlocked ?? false;
          const isSelected = selectedRegion?.id === region.id;
          const completedCount = progress?.completedLevels?.length ?? 0;
          const totalLevels = region.levels.length;

          return (
            <motion.button key={region.id}
              onClick={() => {
                if (!unlocked) return;
                setSelectedRegion(isSelected ? null : region);
              }}
              className="absolute flex flex-col items-center gap-1 group"
              style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%, -50%)" }}
              whileHover={unlocked ? { scale: 1.1 } : {}}
              whileTap={unlocked ? { scale: 0.95 } : {}}>
              {/* Node circle */}
              <motion.div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center"
                animate={unlocked ? {
                  boxShadow: isSelected
                    ? [`0 0 20px ${pos.color}`, `0 0 45px ${pos.color}`, `0 0 20px ${pos.color}`]
                    : [`0 0 10px ${pos.color}55`, `0 0 25px ${pos.color}88`, `0 0 10px ${pos.color}55`],
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  background: unlocked
                    ? `radial-gradient(circle at 35% 35%, ${pos.color}33, oklch(0.1 0.04 280))`
                    : "oklch(0.14 0.03 280)",
                  border: `2px solid ${unlocked ? pos.color : "oklch(0.25 0.05 280)"}`,
                  opacity: unlocked ? 1 : 0.4,
                }}>
                <span className="text-2xl sm:text-3xl" style={{ filter: unlocked ? "none" : "grayscale(1)" }}>
                  {pos.emoji}
                </span>
                {!unlocked && (
                  <div className="absolute inset-0 rounded-full flex items-center justify-center"
                    style={{ background: "oklch(0.08 0.03 280 / 0.7)" }}>
                    <Lock size={16} className="text-muted-foreground" />
                  </div>
                )}
                {/* Completion mini-bar */}
                {unlocked && totalLevels > 0 && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-10 h-1.5 rounded-full overflow-hidden"
                    style={{ background: "oklch(0.2 0.04 280)" }}>
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${(completedCount / totalLevels) * 100}%`, background: pos.color }} />
                  </div>
                )}
              </motion.div>
              {/* Label */}
              <div className="text-center">
                <p className={cn("text-xs font-bold tracking-wide", unlocked ? "text-foreground" : "text-muted-foreground/50")}
                  style={{ textShadow: unlocked ? "0 0 8px oklch(0.08 0.04 280), 0 0 20px oklch(0.08 0.04 280)" : "none" }}>
                  {region.name}
                </p>
                {!unlocked && (
                  <p className="text-xs text-muted-foreground/40">Lv.{region.requiredLevel}</p>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 px-4 pt-4 pb-3 flex items-center gap-3"
        style={{ background: "oklch(0.1 0.04 280 / 0.8)", borderBottom: "1px solid oklch(0.22 0.05 280 / 0.4)", backdropFilter: "blur(16px)" }}>
        <button onClick={() => setGameState("townHub")}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          style={{ background: "oklch(0.16 0.04 280 / 0.5)" }}>
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ background: "oklch(0.55 0.18 45)", color: "#fff" }}>
            {player.level}
          </div>
          <div>
            <p className="text-sm font-bold text-foreground leading-none">{player.name}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <div className="h-1.5 w-20 rounded-full overflow-hidden" style={{ background: "oklch(0.2 0.04 280)" }}>
                <div className="h-full rounded-full" style={{ width: `${(player.experience / player.experienceToNext) * 100}%`, background: "oklch(0.6 0.18 280)" }} />
              </div>
              <span className="text-xs text-muted-foreground">{player.experience}/{player.experienceToNext}</span>
            </div>
          </div>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
            style={{ background: "oklch(0.16 0.04 280 / 0.6)", border: "1px solid oklch(0.28 0.06 280 / 0.5)" }}>
            <span className="text-yellow-400 text-sm">🪙</span>
            <span className="text-sm font-bold text-foreground">{player.gold.toLocaleString()}</span>
          </div>
          <button onClick={() => setGameState("inventory")} className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors" style={{ background: "oklch(0.16 0.04 280 / 0.5)" }}>
            <Package size={18} />
          </button>
          <button onClick={() => setGameState("shop")} className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors" style={{ background: "oklch(0.16 0.04 280 / 0.5)" }}>
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>

      {/* Fog of war overlay on locked regions (general overlay) */}
      <div className="absolute inset-0 pointer-events-none" style={{
        zIndex: 1,
        background: "radial-gradient(ellipse at 50% 110%, oklch(0.07 0.04 280 / 0.8) 0%, transparent 60%)"
      }} />

      {/* Region Detail Slide-in Panel */}
      <AnimatePresence>
        {selectedRegion && (
          <div className="absolute inset-0 z-20" style={{ pointerEvents: "none" }}>
            <div style={{ pointerEvents: "auto", position: "absolute", inset: 0 }}>
              <RegionDetailPanel
                region={selectedRegion as RegionNode}
                onClose={() => setSelectedRegion(null)}
                onEnter={handleEnterRegion} />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
