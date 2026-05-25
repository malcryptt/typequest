"use client";

import { useGameStore } from "@/lib/game/store";
import { CHARACTERS } from "@/lib/game/characters";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ParallaxBackground } from "./cinematic/parallax-background";

export function MainMenuView() {
  const { setGameState, loadGame, hasSavedGame, statistics } = useGameStore();
  const [showNewGame, setShowNewGame] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showCredits, setShowCredits] = useState(false);

  const savedGameExists = hasSavedGame();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      <ParallaxBackground />

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-foreground to-accent mb-4">
            TypeQuest
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground tracking-widest uppercase">
            Fantasy Typing RPG
          </p>
          <div className="mt-4 h-1 w-48 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent" />
        </div>

        {/* Menu Buttons */}
        {!showNewGame && !showStats && !showCredits && (
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <Button
              size="lg"
              className="h-14 text-lg font-semibold"
              onClick={() => setShowNewGame(true)}
            >
              New Game
            </Button>

            {savedGameExists && (
              <Button
                size="lg"
                variant="outline"
                className="h-14 text-lg"
                onClick={() => {
                  loadGame();
                  setGameState("worldMap");
                }}
              >
                Continue
              </Button>
            )}

            <Button
              size="lg"
              variant="outline"
              className="h-14 text-lg"
              onClick={() => setShowStats(true)}
            >
              Statistics
            </Button>

            <Button
              size="lg"
              variant="ghost"
              className="h-14 text-lg"
              onClick={() => setShowCredits(true)}
            >
              Credits
            </Button>
          </div>
        )}

        {/* Character Selection */}
        {showNewGame && (
          <CharacterSelection onBack={() => setShowNewGame(false)} />
        )}

        {/* Statistics */}
        {showStats && <StatisticsView onBack={() => setShowStats(false)} />}

        {/* Credits */}
        {showCredits && <CreditsView onBack={() => setShowCredits(false)} />}
      </div>

      {/* Version */}
      <div className="relative z-10 text-center pb-4">
        <p className="text-xs text-muted-foreground">Version 1.0.0</p>
      </div>

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.7;
          }
        }
        .animate-float {
          animation: float ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

function CharacterSelection({ onBack }: { onBack: () => void }) {
  const { startNewGame, setGameState } = useGameStore();
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState("");

  const characters = Object.values(CHARACTERS);

  const handleStart = () => {
    if (!selectedCharacter || !playerName.trim()) return;
    startNewGame(selectedCharacter, playerName.trim());
    setGameState("townHub");
  };

  return (
    <div className="w-full max-w-4xl">
      <Button variant="ghost" onClick={onBack} className="mb-6">
        Back to Menu
      </Button>

      <h2 className="text-3xl font-bold text-foreground mb-2">Choose Your Hero</h2>
      <p className="text-muted-foreground mb-8">
        Each hero has unique stats and abilities. Choose wisely!
      </p>

      {/* Name Input */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-foreground mb-2">
          Your Name
        </label>
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter your hero's name..."
          className="w-full max-w-sm px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          maxLength={20}
        />
      </div>

      {/* Character Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {characters.map((char) => (
          <button
            key={char.id}
            onClick={() => setSelectedCharacter(char.id)}
            className={cn(
              "p-4 rounded-xl border-2 transition-all text-left",
              "bg-card hover:bg-muted/50",
              selectedCharacter === char.id
                ? "border-primary ring-2 ring-primary/30"
                : "border-border hover:border-primary/50"
            )}
          >
            {/* Character Icon */}
            <div
              className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl"
              style={{ backgroundColor: `${char.color}20` }}
            >
              {char.id === "knight" && "⚔️"}
              {char.id === "mage" && "🔮"}
              {char.id === "rogue" && "🗡️"}
              {char.id === "ranger" && "🏹"}
            </div>

            <h3 className="font-bold text-foreground text-center">{char.name}</h3>
            <p className="text-xs text-muted-foreground text-center mb-3">
              {char.description}
            </p>

            {/* Stats */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">HP</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-2 h-2 rounded-full",
                        i < Math.ceil(char.baseStats.hp / 25)
                          ? "bg-green-500"
                          : "bg-muted"
                      )}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ATK</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-2 h-2 rounded-full",
                        i < Math.ceil(char.baseStats.attack / 4)
                          ? "bg-red-500"
                          : "bg-muted"
                      )}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">DEF</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-2 h-2 rounded-full",
                        i < Math.ceil(char.baseStats.defense / 3)
                          ? "bg-blue-500"
                          : "bg-muted"
                      )}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">SPD</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-2 h-2 rounded-full",
                        i < Math.ceil(char.baseStats.speed / 4)
                          ? "bg-amber-500"
                          : "bg-muted"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Ability Preview */}
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs text-primary">{char.abilities[0].name}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {char.abilities[0].description}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Start Button */}
      <div className="flex justify-center">
        <Button
          size="lg"
          disabled={!selectedCharacter || !playerName.trim()}
          onClick={handleStart}
          className="h-14 px-12 text-lg"
        >
          Begin Your Adventure
        </Button>
      </div>
    </div>
  );
}

function StatisticsView({ onBack }: { onBack: () => void }) {
  const { statistics } = useGameStore();

  const stats = [
    { label: "Total Words Typed", value: statistics.totalWordsTyped.toLocaleString() },
    { label: "Total Characters", value: statistics.totalCharactersTyped.toLocaleString() },
    { label: "Average WPM", value: statistics.averageWpm.toFixed(1) },
    { label: "Best WPM", value: statistics.bestWpm.toFixed(1) },
    { label: "Average Accuracy", value: `${statistics.averageAccuracy.toFixed(1)}%` },
    { label: "Best Accuracy", value: `${statistics.bestAccuracy.toFixed(1)}%` },
    { label: "Battles Won", value: statistics.battlesWon.toLocaleString() },
    { label: "Battles Lost", value: statistics.battlesLost.toLocaleString() },
    { label: "Total Damage Dealt", value: statistics.totalDamageDealt.toLocaleString() },
    { label: "Highest Combo", value: statistics.highestCombo.toLocaleString() },
    { label: "Play Time", value: formatTime(statistics.totalPlayTime) },
  ];

  return (
    <div className="w-full max-w-2xl">
      <Button variant="ghost" onClick={onBack} className="mb-6">
        Back to Menu
      </Button>

      <h2 className="text-3xl font-bold text-foreground mb-8">Your Statistics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-4 rounded-lg bg-card border border-border"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CreditsView({ onBack }: { onBack: () => void }) {
  return (
    <div className="w-full max-w-lg text-center">
      <Button variant="ghost" onClick={onBack} className="mb-6">
        Back to Menu
      </Button>

      <h2 className="text-3xl font-bold text-foreground mb-8">Credits</h2>

      <div className="space-y-6 text-muted-foreground">
        <div>
          <p className="text-foreground font-semibold">Game Design & Development</p>
          <p>ZexLabs</p>
        </div>

        <div>
          <p className="text-foreground font-semibold">Special Thanks</p>
          <p>To all the typists who dare to quest!</p>
        </div>

        <div className="pt-8 border-t border-border">
          <p className="text-sm">
            TypeQuest: Fantasy Typing RPG
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            A game where your keyboard skills become legendary
          </p>
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}
