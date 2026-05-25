"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/game/store";
import { ITEMS, getRarityColor } from "@/lib/game/items";
import type { Item } from "@/lib/game/types";
import { ArrowLeft, Sword, Shield, Gem, FlaskConical, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

const rarityLabel: Record<string, string> = {
  common: "COMMON", uncommon: "UNCOMMON", rare: "RARE", epic: "EPIC", legendary: "LEGENDARY",
};

const SLOT_CONFIG = [
  { slot: "weapon" as const, label: "Weapon", icon: <Sword size={22} /> },
  { slot: "armor" as const, label: "Armor", icon: <Shield size={22} /> },
  { slot: "accessory" as const, label: "Accessory", icon: <Gem size={22} /> },
];

function getItemIcon(item: Item) {
  switch (item.icon) {
    case "sword": return <Sword size={24} />;
    case "shield": return <Shield size={24} />;
    case "gem": return <Gem size={24} />;
    case "potion": return <FlaskConical size={24} />;
    case "crown": return <Crown size={24} />;
    case "wand": return <Sword size={24} />;
    default: return <Gem size={24} />;
  }
}

function StatBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground w-12 uppercase tracking-wider">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
        <motion.div className="h-full rounded-full" style={{ background: color }}
          initial={{ width: 0 }} animate={{ width: `${Math.min(100, (value / max) * 100)}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }} />
      </div>
      <span className="text-xs text-foreground w-8 text-right">{value}</span>
    </div>
  );
}

function ItemCard({ item, qty, onClick, isEquipped }: { item: Item; qty: number; onClick: () => void; isEquipped: boolean }) {
  const rarityColor = getRarityColor(item.rarity);
  return (
    <motion.button onClick={onClick} whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
      className="relative rounded-xl p-2 flex flex-col items-center gap-1 text-center cursor-pointer transition-all"
      style={{ background: "oklch(0.14 0.04 280 / 0.7)", border: `1.5px solid ${isEquipped ? rarityColor : "oklch(0.3 0.06 280 / 0.5)"}`, boxShadow: isEquipped ? `0 0 14px ${rarityColor}55` : "none", backdropFilter: "blur(8px)" }}>
      {isEquipped && (
        <div className="absolute top-1 right-1 text-xs px-1 rounded font-bold"
          style={{ background: rarityColor, color: "#fff", fontSize: "0.55rem" }}>E</div>
      )}
      <div style={{ color: rarityColor }}>{getItemIcon(item)}</div>
      <p className="text-xs text-foreground font-medium leading-tight line-clamp-2">{item.name}</p>
      {qty > 1 && <span className="text-xs text-muted-foreground">x{qty}</span>}
    </motion.button>
  );
}

function EquipSlot({ slotKey, label, icon, equippedId, onClick }: {
  slotKey: "weapon" | "armor" | "accessory"; label: string; icon: React.ReactNode;
  equippedId: string | null; onClick: () => void;
}) {
  const item = equippedId ? ITEMS[equippedId] : null;
  const rarityColor = item ? getRarityColor(item.rarity) : null;
  return (
    <motion.button onClick={onClick} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
      className="rounded-xl p-3 flex flex-col items-center gap-1 text-center w-full"
      style={{
        background: item ? "oklch(0.16 0.05 280 / 0.8)" : "oklch(0.1 0.03 280 / 0.4)",
        border: item ? `1.5px solid ${rarityColor}` : "1.5px dashed oklch(0.35 0.06 280)",
        boxShadow: item && rarityColor ? `0 0 12px ${rarityColor}44` : "none",
        backdropFilter: "blur(8px)",
      }}>
      <span style={{ color: rarityColor ?? "oklch(0.45 0.06 280)" }}>{item ? getItemIcon(item) : icon}</span>
      <p className="text-xs text-foreground font-medium leading-tight line-clamp-1">{item ? item.name : label}</p>
      {!item && <p className="text-xs text-muted-foreground">Empty</p>}
    </motion.button>
  );
}

function ItemDetailSheet({ item, qty, onClose }: { item: Item; qty: number; onClose: () => void }) {
  const { equipItem, unequipItem, equipment } = useGameStore();
  const rarityColor = getRarityColor(item.rarity);
  const isEquipped = Object.values(equipment).includes(item.id);
  const stats = item.stats ?? {};
  return (
    <motion.div className="fixed inset-0 z-50 flex items-end justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div className="relative w-full max-w-lg rounded-t-3xl p-6 z-10"
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ background: "oklch(0.14 0.04 280 / 0.95)", border: `1px solid ${rarityColor}66`, borderBottom: "none", backdropFilter: "blur(20px)", boxShadow: `0 -10px 60px ${rarityColor}33` }}>
        {/* Drag handle */}
        <div className="w-12 h-1 rounded-full bg-muted mx-auto mb-4" />
        <div className="flex gap-4">
          {/* Item art */}
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: `radial-gradient(circle, ${rarityColor}22, oklch(0.1 0.04 280))`, border: `2px solid ${rarityColor}`, boxShadow: `0 0 24px ${rarityColor}55` }}>
            <span style={{ color: rarityColor, transform: "scale(1.6)" }}>{getItemIcon(item)}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-foreground">{item.name}</h2>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider"
              style={{ background: `${rarityColor}22`, color: rarityColor, border: `1px solid ${rarityColor}55` }}>
              {rarityLabel[item.rarity]}
            </span>
            <p className="text-sm text-muted-foreground mt-2 italic">{item.description}</p>
          </div>
        </div>

        {/* Stats */}
        {Object.keys(stats).length > 0 && (
          <div className="mt-4 rounded-xl p-3 space-y-2" style={{ background: "oklch(0.1 0.04 280 / 0.6)" }}>
            {stats.attack && <StatBar label="ATK" value={stats.attack} max={60} color="oklch(0.6 0.22 25)" />}
            {stats.defense && <StatBar label="DEF" value={stats.defense} max={50} color="oklch(0.55 0.18 280)" />}
            {stats.maxHealth && <StatBar label="HP" value={stats.maxHealth} max={100} color="oklch(0.55 0.22 145)" />}
            {stats.maxMana && <StatBar label="MP" value={stats.maxMana} max={80} color="oklch(0.55 0.2 260)" />}
            {stats.speed && <StatBar label="SPD" value={stats.speed} max={20} color="oklch(0.7 0.18 85)" />}
          </div>
        )}
        {qty > 1 && <p className="text-sm text-muted-foreground mt-2">Quantity: {qty}</p>}

        {/* Buttons */}
        <div className="flex gap-3 mt-5">
          {item.type !== "consumable" && (
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => { isEquipped ? unequipItem(item.type as "weapon" | "armor" | "accessory") : equipItem(item.id); onClose(); }}
              className="flex-1 h-12 rounded-xl font-bold text-white transition-all"
              style={{ background: isEquipped ? "oklch(0.4 0.1 280)" : `linear-gradient(135deg, ${rarityColor}, oklch(0.4 0.12 280))`, boxShadow: `0 4px 20px ${rarityColor}55` }}>
              {isEquipped ? "Unequip" : "Equip"}
            </motion.button>
          )}
          <button onClick={onClose}
            className="flex-1 h-12 rounded-xl font-semibold text-muted-foreground hover:text-foreground transition-colors"
            style={{ background: "oklch(0.1 0.03 280 / 0.6)", border: "1px solid oklch(0.3 0.06 280 / 0.5)" }}>
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function InventoryView() {
  const { player, inventory, equipment, setGameState } = useGameStore();
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  if (!player) return null;

  // Build inventory item list
  const inventoryItems = Object.entries(inventory)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => ({ item: ITEMS[id], qty }))
    .filter(({ item }) => !!item);

  const equippedWeapon = equipment.weapon ? ITEMS[equipment.weapon] : null;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.08 0.04 280)" }}>
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: "oklch(0.55 0.2 280)" }} />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-15"
          style={{ background: "oklch(0.55 0.18 45)" }} />
      </div>

      {/* Top Bar */}
      <div className="relative z-10 px-4 pt-4 pb-3 flex items-center gap-3"
        style={{ background: "oklch(0.12 0.04 280 / 0.8)", borderBottom: "1px solid oklch(0.25 0.06 280 / 0.5)", backdropFilter: "blur(16px)" }}>
        <button onClick={() => setGameState("worldMap")}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          style={{ background: "oklch(0.16 0.04 280 / 0.6)" }}>
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-foreground">Inventory</h1>
          <p className="text-xs text-muted-foreground">{player.name} · Lv.{player.level}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
            style={{ background: "oklch(0.16 0.04 280 / 0.6)", border: "1px solid oklch(0.3 0.06 280 / 0.4)" }}>
            <span className="text-yellow-400 text-base">🪙</span>
            <span className="text-sm font-bold text-foreground">{player.gold.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden">
        {/* LEFT — Equipment Panel */}
        <div className="lg:w-72 flex-shrink-0 p-4 flex flex-col gap-4"
          style={{ background: "oklch(0.11 0.04 280 / 0.6)", borderRight: "1px solid oklch(0.22 0.05 280 / 0.4)" }}>
          {/* Weapon spotlight */}
          <div className="rounded-2xl p-4 flex flex-col items-center gap-3"
            style={{ background: "oklch(0.14 0.04 280 / 0.7)", border: "1px solid oklch(0.3 0.06 280 / 0.4)", backdropFilter: "blur(12px)" }}>
            <div className="relative w-24 h-24 rounded-2xl flex items-center justify-center"
              style={{
                background: equippedWeapon
                  ? `radial-gradient(circle, ${getRarityColor(equippedWeapon.rarity)}22, oklch(0.08 0.04 280))`
                  : "oklch(0.1 0.03 280)",
                border: equippedWeapon ? `2px solid ${getRarityColor(equippedWeapon.rarity)}` : "2px dashed oklch(0.3 0.06 280)",
                boxShadow: equippedWeapon ? `0 0 40px ${getRarityColor(equippedWeapon.rarity)}44` : "none",
              }}>
              <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{ color: equippedWeapon ? getRarityColor(equippedWeapon.rarity) : "oklch(0.4 0.06 280)", transform: "scale(2)" }}>
                <Sword size={28} />
              </motion.span>
            </div>
            {equippedWeapon ? (
              <>
                <p className="font-bold text-foreground text-center">{equippedWeapon.name}</p>
                <div className="w-full space-y-2">
                  <StatBar label="ATK" value={equippedWeapon.stats?.attack ?? 0} max={60} color="oklch(0.6 0.22 25)" />
                  <StatBar label="SPD" value={equippedWeapon.stats?.speed ?? 0} max={20} color="oklch(0.7 0.18 85)" />
                  <StatBar label="MAGIC" value={equippedWeapon.stats?.maxMana ?? 0} max={80} color="oklch(0.55 0.2 260)" />
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground text-center">No weapon equipped</p>
            )}
          </div>

          {/* Equipment slots */}
          <div className="grid grid-cols-3 gap-2">
            {SLOT_CONFIG.map(({ slot, label, icon }) => (
              <EquipSlot key={slot} slotKey={slot} label={label} icon={icon}
                equippedId={equipment[slot]}
                onClick={() => { const id = equipment[slot]; if (id && ITEMS[id]) setSelectedItem(ITEMS[id]); }} />
            ))}
          </div>
        </div>

        {/* RIGHT — Inventory Grid */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Bag</h2>
            <span className="text-xs text-muted-foreground">{inventoryItems.length} items</span>
          </div>

          {inventoryItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <div className="text-5xl opacity-30">🎒</div>
              <p className="text-muted-foreground text-sm">Your bag is empty</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-2">
              {inventoryItems.map(({ item, qty }) => (
                <ItemCard key={item.id} item={item} qty={qty}
                  isEquipped={Object.values(equipment).includes(item.id)}
                  onClick={() => setSelectedItem(item)} />
              ))}
              {/* Empty slots to fill grid */}
              {Array.from({ length: Math.max(0, 24 - inventoryItems.length) }).map((_, i) => (
                <div key={`empty-${i}`} className="rounded-xl aspect-square"
                  style={{ border: "1px dashed oklch(0.22 0.04 280 / 0.4)", background: "oklch(0.1 0.03 280 / 0.3)" }} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Item Detail Sheet */}
      <AnimatePresence>
        {selectedItem && (
          <ItemDetailSheet item={selectedItem}
            qty={inventory[selectedItem.id] ?? 1}
            onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
