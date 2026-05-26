"use client";

import { useGameStore } from "@/lib/game/store";
import { CHARACTERS } from "@/lib/game/characters";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ParallaxBackground } from "./cinematic/parallax-background";
import { motion, AnimatePresence } from "framer-motion";

export function MainMenuView() {
  const { setGameState, loadGame, hasSavedGame, statistics } = useGameStore();
  const [showNewGame, setShowNewGame] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showCredits, setShowCredits] = useState(false);

  const savedGameExists = hasSavedGame();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      <ParallaxBackground />

      {/* Lively Terrain Elements behind Main Menu */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        style={{ zIndex: 1 }}
      >
        {/* Flowing River */}
        <path d="M -5,30 C 20,55 55,20 110,60" fill="none" stroke="#1e40af" strokeWidth="4" opacity="0.2" />
        <path d="M -5,30 C 20,55 55,20 110,60" fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity="0.4" />

        {/* Tree clusters - corners */}
        <circle cx="8" cy="12" r="5" fill="#166534" opacity="0.65" />
        <circle cx="12" cy="9" r="3.5" fill="#15803d" opacity="0.75" />
        <circle cx="6" cy="15" r="3" fill="#166534" opacity="0.6" />

        <circle cx="88" cy="88" r="5.5" fill="#166534" opacity="0.65" />
        <circle cx="93" cy="83" r="4" fill="#15803d" opacity="0.75" />
        <circle cx="84" cy="92" r="3.5" fill="#166534" opacity="0.6" />

        {/* Dotted horizon lines */}
        <path d="M 0,40 Q 25,50 50,30 T 100,70" fill="none" stroke="#6d28d9" strokeWidth="0.7" strokeDasharray="2.5,3" opacity="0.45" />
        <path d="M 0,75 Q 30,90 60,65 T 100,25" fill="none" stroke="#6d28d9" strokeWidth="0.5" strokeDasharray="3,4" opacity="0.25" />

        {/* Ground hills */}
        <path d="M 0,85 Q 15,75 35,88 T 70,85 T 110,88 L 110,100 L 0,100 Z" fill="#14532d" opacity="0.25" />
      </svg>

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

  const getStatColor = (val: number, max: number) => {
    const ratio = val / max;
    if (ratio >= 0.8) return "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]";
    if (ratio >= 0.5) return "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]";
    return "bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.8)]";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-6xl flex flex-col items-center"
    >
      <div className="w-full flex justify-between items-center mb-8">
        <Button variant="ghost" onClick={onBack} className="text-foreground/70 hover:text-foreground">
          ← Back to Menu
        </Button>
        <div className="text-center">
          <h2 className="text-4xl font-extrabold tracking-tight" style={{ fontFamily: 'Cinzel, serif', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Choose Your Hero</h2>
          <p className="text-primary/80 mt-1 uppercase tracking-[0.2em] font-semibold text-sm">Destiny Awaits</p>
        </div>
        <div className="w-[110px]" /> {/* Spacer to balance flex layout */}
      </div>

      {/* Name Input */}
      <div className="mb-10 w-full max-w-md">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-primary/30 rounded-xl blur opacity-30 group-focus-within:opacity-100 transition duration-500"></div>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter Hero's Name..."
            className="relative w-full px-6 py-4 rounded-xl bg-background/80 backdrop-blur-xl border border-primary/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 text-center text-xl font-bold tracking-wider uppercase transition-all"
            maxLength={20}
          />
        </div>
      </div>

      {/* Character Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-12">
        {characters.map((char, index) => (
          <motion.div
            key={char.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            onClick={() => setSelectedCharacter(char.id)}
            className={cn(
              "relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-300",
              selectedCharacter === char.id ? "scale-[1.02] shadow-[0_0_30px_rgba(200,150,50,0.2)]" : "hover:scale-[1.01] hover:shadow-xl opacity-80 hover:opacity-100"
            )}
          >
            {/* Outline Glow for Selected */}
            <div className={cn(
              "absolute inset-0 border-2 rounded-2xl transition-all duration-300 pointer-events-none z-10",
              selectedCharacter === char.id ? "border-primary shadow-[inset_0_0_20px_rgba(200,150,50,0.2)]" : "border-border/30"
            )} />

            {/* Background Panel */}
            <div className="absolute inset-0 bg-card/60 backdrop-blur-md" />

            <div className="relative p-6 z-20 flex flex-col items-center h-full">
              {/* Icon / Avatar */}
              <div
                className="w-20 h-20 rounded-full mb-4 flex items-center justify-center text-4xl shadow-inner border border-primary/20"
                style={{ backgroundColor: `${char.color}15`, boxShadow: `inset 0 0 20px ${char.color}20` }}
              >
                {char.id === "knight" && "⚔️"}
                {char.id === "mage" && "🔮"}
                {char.id === "rogue" && "🗡️"}
                {char.id === "ranger" && "🏹"}
              </div>

              <h3 className="text-2xl font-bold tracking-tight mb-1" style={{ fontFamily: 'Cinzel, serif' }}>{char.name}</h3>
              <p className="text-primary italic text-xs mb-4">{char.title}</p>

              <p className="text-sm text-foreground/70 text-center mb-6 flex-grow leading-relaxed">
                {char.description}
              </p>

              {/* Stats Block */}
              <div className="w-full space-y-3 bg-background/40 rounded-xl p-4 border border-border/40">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground w-6">HP</span>
                  <div className="flex-grow h-1.5 bg-background/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(char.baseStats.hp / 120) * 100}%` }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.6, ease: "easeOut" }}
                      className={cn("h-full rounded-full", getStatColor(char.baseStats.hp, 120))}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground w-6">ATK</span>
                  <div className="flex-grow h-1.5 bg-background/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(char.baseStats.attack / 20) * 100}%` }}
                      transition={{ delay: index * 0.1 + 0.4, duration: 0.6, ease: "easeOut" }}
                      className={cn("h-full rounded-full", getStatColor(char.baseStats.attack, 20))}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground w-6">DEF</span>
                  <div className="flex-grow h-1.5 bg-background/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(char.baseStats.defense / 15) * 100}%` }}
                      transition={{ delay: index * 0.1 + 0.5, duration: 0.6, ease: "easeOut" }}
                      className={cn("h-full rounded-full", getStatColor(char.baseStats.defense, 15))}
                    />
                  </div>
                </div>
              </div>

              {/* Ability Preview */}
              <div className="w-full mt-4 pt-4 border-t border-border/30">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <p className="text-xs font-bold text-primary tracking-wide uppercase">{char.abilities[0].name}</p>
                </div>
                <p className="text-[11px] text-muted-foreground/80 line-clamp-2 pr-2">
                  {char.abilities[0].description}
                </p>
              </div>

            </div>
          </motion.div>
        ))}
      </div>

      {/* Start Button */}
      <AnimatePresence>
        {selectedCharacter && playerName.trim() && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex justify-center"
          >
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-amber-600 rounded-xl blur opacity-40 group-hover:opacity-75 transition duration-500 animate-pulse"></div>
              <Button
                size="lg"
                onClick={handleStart}
                className="relative h-16 px-16 text-xl tracking-widest font-bold uppercase border-2 border-primary/50 bg-background/50 hover:bg-background/80 backdrop-blur-md overflow-hidden"
                style={{ fontFamily: 'Cinzel, serif' }}
              >
                <span className="relative z-10 drop-shadow-md">Begin Journey</span>
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-[100%] group-hover:animate-[shimmer_2s_infinite]"></div>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
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
