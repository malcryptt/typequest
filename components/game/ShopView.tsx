"use client";

import { useGameStore } from "@/lib/game/store";
import { ITEMS, getRarityColor } from "@/lib/game/items";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Coins, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const SHOP_ITEMS = [
  { id: "health-potion", price: 50 },
  { id: "mana-potion", price: 75 },
  { id: "elixir", price: 150 },
  { id: "wooden-sword", price: 200 },
  { id: "wyrm-fang-blade", price: 500 },
  { id: "cloth-armor", price: 150 },
  { id: "hydra-scale-mail", price: 400 },
  { id: "treant-bark-shield", price: 100 },
  { id: "sprite-ring", price: 300 },
  { id: "dragonheart-amulet", price: 800 },
];

function ShopItemCard({
  id, price,
  selected, canAfford, ownedCount,
  onClick, onBuy
}: {
  id: string, price: number,
  selected: boolean, canAfford: boolean, ownedCount: number,
  onClick: () => void, onBuy: () => void
}) {
  const item = ITEMS[id];
  if (!item) return null;

  const color = getRarityColor(item.rarity);
  const isEquip = item.type === "weapon" || item.type === "armor" || item.type === "accessory";

  return (
    <motion.button onClick={onClick} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
      className="relative rounded-2xl p-4 flex flex-col justify-between text-left transition-all overflow-hidden"
      style={{
        background: selected ? "oklch(0.18 0.05 280 / 0.9)" : "oklch(0.14 0.04 280 / 0.7)",
        border: `1.5px solid ${selected ? color : "oklch(0.3 0.06 280 / 0.5)"}`,
        boxShadow: selected ? `0 0 30px ${color}44` : "none",
        backdropFilter: "blur(12px)"
      }}>
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: color }} />

      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-lg border"
            style={{ background: `radial-gradient(circle, ${color}33, oklch(0.1 0.04 280))`, borderColor: `${color}66` }}>
            {item.icon === "sword" ? "⚔️" : item.icon === "shield" ? "🛡️" : item.icon === "potion" ? "🧪" : item.icon === "wand" ? "🪄" : "💍"}
          </div>
          {ownedCount > 0 && (
            <div className="px-2 py-1 flex items-center gap-1 rounded-md text-xs font-bold" style={{ background: "oklch(0.2 0.06 280)", border: "1px solid oklch(0.3 0.06 280)" }}>
              {isEquip && <CheckCircle2 size={12} className="text-green-400" />}
              {isEquip ? "Owned" : `x${ownedCount}`}
            </div>
          )}
        </div>

        <h3 className="font-bold text-foreground text-base tracking-tight mb-0.5">{item.name}</h3>
        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ color, background: `${color}22` }}>
          {item.rarity}
        </span>
        <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{item.description}</p>

        {item.stats && (
          <div className="flex gap-2 mt-3">
            {item.stats.attack && <span className="text-[10px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded font-medium">+{item.stats.attack} ATK</span>}
            {item.stats.defense && <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-medium">+{item.stats.defense} DEF</span>}
            {item.stats.maxMana && <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-medium">+{item.stats.maxMana} MANA</span>}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 flex items-center justify-between" style={{ borderTop: "1px dashed oklch(0.3 0.06 280 / 0.5)" }}>
        <div className="flex items-center gap-1.5">
          <Coins size={14} className="text-yellow-400" />
          <span className="text-sm font-bold text-yellow-100">{price}</span>
        </div>

        <button className={cn("px-4 py-1.5 rounded-lg text-xs font-bold transition-all", canAfford ? "hover:brightness-125 hover:shadow-lg" : "opacity-50 cursor-not-allowed")}
          onClick={(e) => { e.stopPropagation(); onBuy(); }} disabled={!canAfford}
          style={{ background: canAfford ? "oklch(0.55 0.2 280)" : "oklch(0.2 0.04 280)", color: canAfford ? "#fff" : "oklch(0.5 0.04 280)" }}>
          Buy
        </button>
      </div>
    </motion.button>
  );
}

export function ShopView() {
  const { player, inventory, addItem, setGameState } = useGameStore();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error", id: number } | null>(null);

  if (!player) return null;

  const buyItem = (itemId: string, price: number) => {
    if (player.gold < price) {
      setMessage({ text: "Not enough gold!", type: "error", id: Date.now() });
      return;
    }
    useGameStore.setState((state) => ({ player: state.player ? { ...state.player, gold: state.player.gold - price } : null }));
    addItem(itemId, 1);
    setMessage({ text: `Purchased ${ITEMS[itemId].name}!`, type: "success", id: Date.now() });
  };

  return (
    <div className="min-h-screen flex flex-col relative" style={{ background: "oklch(0.08 0.04 280)" }}>
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-96 opacity-20" style={{ background: "linear-gradient(to bottom, oklch(0.55 0.15 45), transparent)" }} />
        <div className="absolute -left-32 top-32 w-96 h-96 rounded-full blur-[100px] opacity-10" style={{ background: "oklch(0.65 0.2 40)" }} />
        <div className="absolute -right-32 bottom-32 w-96 h-96 rounded-full blur-[100px] opacity-10" style={{ background: "oklch(0.55 0.18 280)" }} />
      </div>

      {/* Top Bar */}
      <div className="relative z-20 px-4 pt-4 pb-3 flex items-center justify-between"
        style={{ background: "oklch(0.1 0.04 280 / 0.8)", borderBottom: "1px solid oklch(0.25 0.06 280 / 0.4)", backdropFilter: "blur(16px)" }}>
        <div className="flex items-center gap-3">
          <button onClick={() => setGameState("worldMap")} className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors" style={{ background: "oklch(0.16 0.04 280 / 0.6)" }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground leading-tight">Merchant Aldric</h1>
            <p className="text-xs text-muted-foreground">The best wares in all the realm.</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl shadow-inner" style={{ background: "oklch(0.13 0.04 280)", border: "1px solid oklch(0.28 0.06 280 / 0.6)" }}>
          <Coins size={16} className="text-yellow-400" />
          <span className="text-sm font-bold text-foreground">{player.gold.toLocaleString()}</span>
        </div>
      </div>

      {/* Toast Messages */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <AnimatePresence>
          {message && (
            <motion.div key={message.id} initial={{ opacity: 0, y: -20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="px-6 py-3 rounded-2xl border shadow-xl flex items-center gap-2"
              style={{
                background: message.type === "success" ? "oklch(0.2 0.08 145 / 0.9)" : "oklch(0.2 0.1 25 / 0.9)",
                borderColor: message.type === "success" ? "oklch(0.6 0.15 145 / 0.4)" : "oklch(0.6 0.15 25 / 0.4)",
                backdropFilter: "blur(12px)"
              }}>
              <span className="text-sm font-bold" style={{ color: message.type === "success" ? "oklch(0.8 0.1 145)" : "oklch(0.8 0.1 25)" }}>
                {message.text}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Grid */}
      <div className="relative z-10 flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-10">

          {/* Shopkeeper Portrait & Dialogue */}
          <div className="lg:w-80 flex-shrink-0 flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-3xl p-6 h-72 border flex flex-col justify-end"
              style={{ background: "oklch(0.12 0.04 280 / 0.8)", borderColor: "oklch(0.3 0.06 280 / 0.6)", backdropFilter: "blur(20px)", boxShadow: "0 10px 40px oklch(0.05 0.04 280 / 0.5)" }}>
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: "oklch(0.65 0.2 40)" }} />
              <div className="absolute inset-0 flex items-center justify-center opacity-40 text-9xl -translate-y-4">🧙</div>
              <div className="relative z-10 p-4 rounded-2xl" style={{ background: "oklch(0.08 0.04 280 / 0.95)", border: "1px solid oklch(0.2 0.06 280)" }}>
                <p className="text-sm text-amber-100/90 font-medium italic leading-relaxed">
                  "Take your time, hero. Good gear makes the difference between words and wisdom."
                </p>
              </div>
            </div>
          </div>

          {/* Shop Inventory */}
          <div className="flex-1">
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 ml-1">Wares for Sale</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {SHOP_ITEMS.map(({ id, price }) => (
                <ShopItemCard key={id} id={id} price={price}
                  selected={selectedItem === id}
                  canAfford={player.gold >= price}
                  ownedCount={inventory[id] || 0}
                  onClick={() => setSelectedItem(id)}
                  onBuy={() => buyItem(id, price)} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
