"use client";

import { useGameStore } from "@/lib/game/store";
import { ITEMS, ItemType, Item as ItemData, EquipmentSlot } from "@/lib/game/items";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SLOT_LABELS: Record<EquipmentSlot, string> = {
  weapon: "Weapon",
  armor: "Armor",
  accessory: "Accessory",
};

const TYPE_ICONS: Record<ItemType, string> = {
  weapon: "⚔️",
  armor: "🛡️",
  accessory: "💍",
  consumable: "🧪",
};

function ItemCard({
  item,
  quantity,
  isEquipped,
  onEquip,
  onUnequip,
  onUse,
  showActions = true,
}: {
  item: ItemData;
  quantity: number;
  isEquipped?: boolean;
  onEquip?: () => void;
  onUnequip?: () => void;
  onUse?: () => void;
  showActions?: boolean;
}) {
  const rarityColors = {
    common: "border-muted bg-muted/20",
    uncommon: "border-green-500/50 bg-green-500/10",
    rare: "border-blue-500/50 bg-blue-500/10",
    epic: "border-purple-500/50 bg-purple-500/10",
    legendary: "border-amber-500/50 bg-amber-500/10",
  };

  const rarityGlow = {
    common: "",
    uncommon: "shadow-green-500/20",
    rare: "shadow-blue-500/20",
    epic: "shadow-purple-500/20",
    legendary: "shadow-amber-500/30 shadow-lg",
  };

  return (
    <div
      className={cn(
        "relative border-2 rounded-lg p-3 transition-all hover:scale-[1.02]",
        rarityColors[item.rarity],
        rarityGlow[item.rarity],
        isEquipped && "ring-2 ring-primary"
      )}
    >
      {isEquipped && (
        <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
          Equipped
        </div>
      )}

      <div className="flex items-start gap-3">
        <div className="text-3xl">{TYPE_ICONS[item.type]}</div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-foreground truncate">{item.name}</h4>
          <p className="text-xs text-muted-foreground capitalize">{item.rarity} {item.type}</p>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>

          {item.stats && (
            <div className="mt-2 flex flex-wrap gap-1">
              {item.stats.attack && (
                <span className="text-xs bg-destructive/20 text-destructive px-1.5 py-0.5 rounded">
                  +{item.stats.attack} ATK
                </span>
              )}
              {item.stats.defense && (
                <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                  +{item.stats.defense} DEF
                </span>
              )}
              {item.stats.speed && (
                <span className="text-xs bg-accent/20 text-accent-foreground px-1.5 py-0.5 rounded">
                  +{item.stats.speed} SPD
                </span>
              )}
              {item.stats.critChance && (
                <span className="text-xs bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">
                  +{item.stats.critChance}% CRIT
                </span>
              )}
            </div>
          )}

          {item.effect && (
            <p className="text-xs text-accent mt-1">Effect: {item.effect}</p>
          )}

          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">x{quantity}</span>
            {showActions && (
              <div className="flex gap-1">
                {item.type === "consumable" && onUse && (
                  <Button size="sm" variant="secondary" onClick={onUse} className="h-6 text-xs px-2">
                    Use
                  </Button>
                )}
                {item.slot && !isEquipped && onEquip && (
                  <Button size="sm" onClick={onEquip} className="h-6 text-xs px-2">
                    Equip
                  </Button>
                )}
                {isEquipped && onUnequip && (
                  <Button size="sm" variant="outline" onClick={onUnequip} className="h-6 text-xs px-2">
                    Unequip
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EquipmentSlotDisplay({
  slot,
  equippedItemId,
  onUnequip,
}: {
  slot: EquipmentSlot;
  equippedItemId: string | null;
  onUnequip: () => void;
}) {
  const item = equippedItemId ? ITEMS[equippedItemId] : null;

  return (
    <div className="border border-border rounded-lg p-3 bg-card/50">
      <h4 className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
        {SLOT_LABELS[slot]}
      </h4>
      {item ? (
        <ItemCard
          item={item}
          quantity={1}
          isEquipped
          onUnequip={onUnequip}
          showActions={true}
        />
      ) : (
        <div className="h-20 flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
          <span className="text-muted-foreground text-sm">Empty</span>
        </div>
      )}
    </div>
  );
}

export function InventoryView() {
  const { player, inventory, equipment, equipItem, unequipItem, useItem, setGameState } = useGameStore();
  const [filter, setFilter] = useState<ItemType | "all">("all");
  const [sortBy, setSortBy] = useState<"name" | "rarity" | "type">("rarity");

  const rarityOrder = { legendary: 0, epic: 1, rare: 2, uncommon: 3, common: 4 };

  const inventoryItems = Object.entries(inventory)
    .filter(([, qty]) => qty > 0)
    .map(([id, quantity]) => ({ id, item: ITEMS[id], quantity }))
    .filter(({ item }) => item && (filter === "all" || item.type === filter))
    .sort((a, b) => {
      if (sortBy === "name") return a.item.name.localeCompare(b.item.name);
      if (sortBy === "rarity") return rarityOrder[a.item.rarity] - rarityOrder[b.item.rarity];
      return a.item.type.localeCompare(b.item.type);
    });

  const isEquipped = (itemId: string) => {
    return Object.values(equipment).includes(itemId);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Inventory</h1>
            <p className="text-muted-foreground">
              {player?.name} - Level {player?.level} {player?.characterId}
            </p>
          </div>
          <Button variant="outline" onClick={() => setGameState("worldMap")}>
            Back to Map
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Equipment Panel */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-4">
              <h2 className="text-xl font-bold mb-4 text-foreground">Equipment</h2>
              
              {/* Character Stats Summary */}
              <div className="bg-muted/30 rounded-lg p-3 mb-4">
                <h3 className="text-sm font-semibold mb-2 text-foreground">Stats</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">HP:</span>
                    <span className="text-foreground">{player?.hp}/{player?.maxHp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ATK:</span>
                    <span className="text-destructive">{player?.attack}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">DEF:</span>
                    <span className="text-primary">{player?.defense}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SPD:</span>
                    <span className="text-accent">{player?.speed}</span>
                  </div>
                </div>
              </div>

              {/* Equipment Slots */}
              <div className="space-y-3">
                {(["weapon", "armor", "accessory"] as EquipmentSlot[]).map((slot) => (
                  <EquipmentSlotDisplay
                    key={slot}
                    slot={slot}
                    equippedItemId={equipment[slot]}
                    onUnequip={() => unequipItem(slot)}
                  />
                ))}
              </div>

              {/* Gold */}
              <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center justify-between">
                <span className="text-amber-400 font-semibold">Gold</span>
                <span className="text-amber-300 font-bold text-xl">{player?.gold || 0}</span>
              </div>
            </div>
          </div>

          {/* Inventory Panel */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <h2 className="text-xl font-bold text-foreground">Items</h2>
                
                <div className="flex flex-wrap gap-2">
                  {/* Filter */}
                  <div className="flex gap-1">
                    {(["all", "weapon", "armor", "accessory", "consumable"] as const).map((type) => (
                      <Button
                        key={type}
                        size="sm"
                        variant={filter === type ? "default" : "ghost"}
                        onClick={() => setFilter(type)}
                        className="h-8 text-xs capitalize"
                      >
                        {type === "all" ? "All" : TYPE_ICONS[type]}
                      </Button>
                    ))}
                  </div>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="h-8 text-xs bg-muted border border-border rounded px-2 text-foreground"
                  >
                    <option value="rarity">By Rarity</option>
                    <option value="name">By Name</option>
                    <option value="type">By Type</option>
                  </select>
                </div>
              </div>

              {inventoryItems.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-muted-foreground">
                  <div className="text-4xl mb-2">📦</div>
                  <p>No items found</p>
                  <p className="text-sm">Defeat enemies to collect loot!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2">
                  {inventoryItems.map(({ id, item, quantity }) => (
                    <ItemCard
                      key={id}
                      item={item}
                      quantity={quantity}
                      isEquipped={isEquipped(id)}
                      onEquip={() => item.slot && equipItem(id)}
                      onUnequip={() => item.slot && unequipItem(item.slot)}
                      onUse={() => useItem(id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
