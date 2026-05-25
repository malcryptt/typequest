"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ParallaxBackground } from "./parallax-background";
import { HudPanel, StatDisplay } from "./hud-panel";
import { WordDisplay } from "./word-display";
import { TimerBar } from "./timer-bar";
import { CharacterSlot } from "./character-slot";
import { Heart, Flame, Coins, Gauge, Trophy } from "lucide-react";

const WORD_LIST = [
  "dragon", "wizard", "castle", "potion", "quest", "magic", "sword", 
  "shield", "armor", "spell", "crystal", "ancient", "mystic", "rune",
  "portal", "dungeon", "treasure", "knight", "sorcery", "enchant",
  "phoenix", "griffin", "chimera", "basilisk", "hydra", "kraken"
];

const TIME_PER_WORD = 8000; // 8 seconds per word

export function TypeQuestGame() {
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [coins, setCoins] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [stage, setStage] = useState(1);
  const [progress, setProgress] = useState(0);
  const [maxProgress] = useState(5); // Words per stage
  
  const [currentWord, setCurrentWord] = useState("");
  const [typedChars, setTypedChars] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<number>(0);
  const totalCharsRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const wordStartTimeRef = useRef<number>(0);

  const getRandomWord = useCallback(() => {
    return WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
  }, []);

  const startNewWord = useCallback(() => {
    const word = getRandomWord();
    setCurrentWord(word);
    setTypedChars("");
    setTimeRemaining(1);
    wordStartTimeRef.current = Date.now();
  }, [getRandomWord]);

  const startGame = useCallback(() => {
    setLives(3);
    setStreak(0);
    setCoins(0);
    setWpm(0);
    setStage(1);
    setProgress(0);
    setGameOver(false);
    setIsPlaying(true);
    startTimeRef.current = Date.now();
    totalCharsRef.current = 0;
    startNewWord();
    inputRef.current?.focus();
  }, [startNewWord]);

  const handleWordComplete = useCallback((success: boolean) => {
    if (success) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      // Bonus coins for streak
      const streakBonus = Math.floor(newStreak / 5) * 5;
      setCoins(prev => prev + 10 + streakBonus);
      
      const newProgress = progress + 1;
      setProgress(newProgress);
      
      // Stage progression
      if (newProgress >= maxProgress) {
        setStage(prev => prev + 1);
        setProgress(0);
      }
      
      startNewWord();
    } else {
      setStreak(0);
      const newLives = lives - 1;
      setLives(newLives);
      
      if (newLives <= 0) {
        setGameOver(true);
        setIsPlaying(false);
      } else {
        startNewWord();
      }
    }
  }, [streak, progress, maxProgress, lives, startNewWord]);

  // Timer effect
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - wordStartTimeRef.current;
      const remaining = Math.max(0, 1 - elapsed / TIME_PER_WORD);
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        handleWordComplete(false);
      }

      // Update WPM
      const totalTime = (Date.now() - startTimeRef.current) / 1000 / 60;
      if (totalTime > 0) {
        setWpm(Math.round(totalCharsRef.current / 5 / totalTime));
      }
    }, 50);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, gameOver, handleWordComplete]);

  // Handle input
  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isPlaying || gameOver) return;
    
    const value = e.target.value;
    setTypedChars(value);
    totalCharsRef.current += 1;

    // Check if word is complete
    if (value.length === currentWord.length) {
      const isCorrect = value.toLowerCase() === currentWord.toLowerCase();
      handleWordComplete(isCorrect);
      e.target.value = "";
    }
  }, [isPlaying, gameOver, currentWord, handleWordComplete]);

  // Focus input on click anywhere
  const handleContainerClick = useCallback(() => {
    inputRef.current?.focus();
    if (!isPlaying && !gameOver) {
      startGame();
    }
  }, [isPlaying, gameOver, startGame]);

  // Keyboard handler for restart
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver && e.key === "Enter") {
        startGame();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameOver, startGame]);

  return (
    <div 
      className="relative w-full h-screen overflow-hidden cursor-pointer select-none"
      onClick={handleContainerClick}
    >
      {/* Hidden input for typing */}
      <input
        ref={inputRef}
        type="text"
        className="absolute opacity-0 w-0 h-0 pointer-events-none"
        onInput={handleInput}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
      />
      
      {/* Parallax Background */}
      <ParallaxBackground />
      
      {/* HUD Top Row */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
        {/* Lives - Top Left */}
        <HudPanel>
          <StatDisplay
            icon={<Heart className="fill-current" />}
            value={lives}
            label="Lives"
            accentColor="var(--wrong-color)"
          />
        </HudPanel>
        
        {/* Streak - Top Center */}
        <HudPanel>
          <StatDisplay
            icon={<Flame className="fill-current" />}
            value={streak}
            label="Streak"
            accentColor="oklch(0.75 0.2 40)"
          />
        </HudPanel>
        
        {/* Coins - Top Right */}
        <HudPanel>
          <StatDisplay
            icon={<Coins className="fill-current" />}
            value={coins}
            label="Coins"
            accentColor="oklch(0.8 0.18 85)"
          />
        </HudPanel>
      </div>
      
      {/* Main Game Area - Center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        {!isPlaying && !gameOver && (
          <div className="text-center">
            <h1 
              className="text-5xl md:text-7xl font-bold mb-4 text-foreground"
              style={{
                textShadow: "0 0 30px var(--world-accent-color), 0 4px 20px rgba(0,0,0,0.5)",
              }}
            >
              TypeQuest
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Click anywhere or press any key to begin
            </p>
            <HudPanel className="inline-block px-8 py-4">
              <span className="text-lg">Press any key to start</span>
            </HudPanel>
          </div>
        )}
        
        {isPlaying && !gameOver && (
          <div className="flex flex-col items-center gap-8 w-full max-w-2xl px-4">
            {/* Word Display */}
            <WordDisplay word={currentWord} typedChars={typedChars} />
            
            {/* Timer Bar */}
            <TimerBar progress={timeRemaining} className="w-full max-w-md" />
          </div>
        )}
        
        {gameOver && (
          <div className="text-center">
            <h2 
              className="text-4xl md:text-6xl font-bold mb-4 text-[var(--wrong-color)]"
              style={{
                textShadow: "0 0 30px var(--wrong-color), 0 4px 20px rgba(0,0,0,0.5)",
              }}
            >
              Game Over
            </h2>
            <div className="flex flex-col gap-4 mb-8">
              <p className="text-2xl text-foreground">Stage {stage}</p>
              <p className="text-xl text-muted-foreground">Final WPM: {wpm}</p>
              <p className="text-xl text-muted-foreground">Coins Earned: {coins}</p>
            </div>
            <HudPanel className="inline-block px-8 py-4 cursor-pointer hover:scale-105 transition-transform">
              <span className="text-lg">Press Enter to play again</span>
            </HudPanel>
          </div>
        )}
      </div>
      
      {/* Character Slot - Bottom Left */}
      <div className="absolute bottom-8 left-8 z-10">
        <CharacterSlot characterEmoji="🧙" />
      </div>
      
      {/* Bottom HUD Row */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-8 z-10">
        {/* WPM - Bottom Center */}
        <HudPanel>
          <StatDisplay
            icon={<Gauge />}
            value={wpm}
            label="WPM"
          />
        </HudPanel>
      </div>
      
      {/* Stage Progress - Bottom Right */}
      <div className="absolute bottom-4 right-4 z-10">
        <HudPanel className="flex items-center gap-3">
          <Trophy className="text-[var(--world-accent-color)]" />
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Stage {stage}</span>
            <div className="flex gap-1">
              {Array.from({ length: maxProgress }).map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: i < progress 
                      ? "var(--world-accent-color)" 
                      : "var(--muted)",
                    boxShadow: i < progress 
                      ? "0 0 8px var(--world-accent-color)" 
                      : "none",
                  }}
                />
              ))}
            </div>
          </div>
        </HudPanel>
      </div>
    </div>
  );
}
