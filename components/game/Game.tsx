"use client";

import { useEffect } from "react";
import { useGameStore, GameState } from "@/lib/game/store";
import { MainMenuView } from "./MainMenuView";
import { WorldMapView } from "./WorldMapView";
import { CombatView } from "./CombatView";
import { InventoryView } from "./InventoryView";
import { ShopView } from "./ShopView";
import { TownHubView } from "./DialogueView";
import { LevelCompleteScreen, GameOverScreen } from "./ResultScreens";

export function Game() {
  const { gameState, loadGame, currentLevel, player } = useGameStore();

  // Load saved game on mount
  useEffect(() => {
    const savedData = localStorage.getItem("typequest-save");
    if (savedData) {
      // Don't auto-load, let user choose from menu
    }
  }, []);

  // Track play time
  useEffect(() => {
    if (gameState !== "mainMenu") {
      const interval = setInterval(() => {
        useGameStore.setState((state) => ({
          statistics: {
            ...state.statistics,
            totalPlayTime: state.statistics.totalPlayTime + 1,
          },
        }));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameState]);

  // Auto-save periodically
  useEffect(() => {
    if (gameState !== "mainMenu" && player) {
      const interval = setInterval(() => {
        useGameStore.getState().saveGame();
      }, 30000); // Save every 30 seconds

      return () => clearInterval(interval);
    }
  }, [gameState, player]);

  const renderView = () => {
    switch (gameState) {
      case "mainMenu":
        return <MainMenuView />;
      case "townHub":
        return <TownHubView />;
      case "worldMap":
        return <WorldMapView />;
      case "combat":
        return <CombatView />;
      case "inventory":
        return <InventoryView />;
      case "shop":
        return <ShopView />;
      case "levelComplete":
        return <LevelCompleteScreen />;
      case "gameOver":
        return <GameOverScreen />;
      default:
        return <MainMenuView />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderView()}
    </div>
  );
}
