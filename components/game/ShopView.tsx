"use client";

import { useGameStore } from "@/lib/game/store";
import { ITEMS } from "@/lib/game/items";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SHOP_ITEMS = [
  { id: "health_potion", price: 50 },
  { id: "mana_potion", price: 75 },
  { id: "strength_elixir", price: 150 },
  { id: "iron_sword", price: 200 },
  { id: "steel_sword", price: 500 },
  { id: "leather_armor", price: 150 },
  { id: "chainmail", price: 400 },
  { id: "wooden_shield", price: 100 },
  { id: "lucky_charm", price: 300 },
  { id: "swift_boots", price: 350 },
];

export function ShopView() {
  const { player, inventory, addItem, setGameState } = useGameStore();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const buyItem = (itemId: string, price: number) => {
    if (!player) return;
    
    if (player.gold < price) {
      setMessage({ text: "Not enough gold!", type: "error" });
      setTimeout(() => setMessage(null), 2000);
      return;
    }

    // Deduct gold and add item
    useGameStore.setState((state) => ({
      player: state.player ? { ...state.player, gold: state.player.gold - price } : null,
    }));
    addItem(itemId, 1);
    
    setMessage({ text: `Purchased ${ITEMS[itemId].name}!`, type: "success" });
    setTimeout(() => setMessage(null), 2000);
  };

  const rarityColors = {
    common: "border-muted",
    uncommon: "border-green-500/50",
    rare: "border-blue-500/50",
    epic: "border-purple-500/50",
    legendary: "border-amber-500/50",
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">General Store</h1>
            <p className="text-muted-foreground">Buy supplies for your adventure</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-2">
              <span className="text-amber-400 mr-2">Gold:</span>
              <span className="text-amber-300 font-bold">{player?.gold || 0}</span>
            </div>
            <Button variant="outline" onClick={() => setGameState("worldMap")}>
              Back to Map
            </Button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className={cn(
              "mb-4 p-3 rounded-lg text-center font-medium",
              message.type === "success" ? "bg-green-500/20 text-green-400" : "bg-destructive/20 text-destructive"
            )}
          >
            {message.text}
          </div>
        )}

        {/* Shopkeeper */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-3xl">
              🧙
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-foreground">Merchant Aldric</h3>
              <p className="text-muted-foreground italic">
                {`"Welcome, traveler! I have the finest wares in all the realm. Take a look around!"`}
              </p>
            </div>
          </div>
        </div>

        {/* Shop Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SHOP_ITEMS.map(({ id, price }) => {
            const item = ITEMS[id];
            if (!item) return null;

            const owned = inventory[id] || 0;
            const canAfford = (player?.gold || 0) >= price;

            return (
              <div
                key={id}
                className={cn(
                  "border-2 rounded-xl p-4 transition-all cursor-pointer",
                  rarityColors[item.rarity],
                  selectedItem === id ? "ring-2 ring-primary" : "",
                  "hover:bg-muted/30"
                )}
                onClick={() => setSelectedItem(id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">
                        {item.type === "weapon" ? "⚔️" : item.type === "armor" ? "🛡️" : item.type === "accessory" ? "💍" : "🧪"}
                      </span>
                      <div>
                        <h4 className="font-bold text-foreground">{item.name}</h4>
                        <p className="text-xs text-muted-foreground capitalize">{item.rarity}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{item.description}</p>

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
                      </div>
                    )}
                  </div>

                  <div className="text-right ml-4">
                    <div className="text-amber-400 font-bold">{price}g</div>
                    {owned > 0 && <div className="text-xs text-muted-foreground">Owned: {owned}</div>}
                  </div>
                </div>

                <div className="mt-3 flex justify-end">
                  <Button
                    size="sm"
                    disabled={!canAfford}
                    onClick={(e) => {
                      e.stopPropagation();
                      buyItem(id, price);
                    }}
                    className={cn(!canAfford && "opacity-50")}
                  >
                    {canAfford ? "Buy" : "Not Enough Gold"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
