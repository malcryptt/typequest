'use client';

import { useState } from 'react';
import { useGameStore } from '@/lib/game/store';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Region, Level } from '@/lib/game/types';

// Region card component
function RegionCard({
  region,
  isSelected,
  onSelect
}: {
  region: Region;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const { progress } = useGameStore();
  const completedLevels = region.levels.filter(l => l.completed).length;
  const totalLevels = region.levels.length;
  const progressPercent = (completedLevels / totalLevels) * 100;

  const isLocked = !region.unlocked;

  return (
    <button
      onClick={onSelect}
      disabled={isLocked}
      className={cn(
        "relative w-full p-4 rounded-xl border-2 transition-all text-left",
        isSelected
          ? "border-primary bg-primary/10 scale-105 shadow-lg"
          : "border-border bg-card hover:border-primary/50 hover:bg-card/80",
        isLocked && "opacity-50 cursor-not-allowed grayscale"
      )}
    >
      {/* Lock overlay */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl z-10">
          <div className="text-center">
            <svg
              className="w-8 h-8 mx-auto mb-2 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span className="text-sm text-muted-foreground">Level {region.requiredLevel} Required</span>
          </div>
        </div>
      )}

      {/* Region color indicator */}
      <div
        className="w-full h-2 rounded-full mb-3"
        style={{ backgroundColor: region.color }}
      />

      {/* Region info */}
      <h3 className="text-lg font-bold text-foreground mb-1">{region.name}</h3>
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{region.description}</p>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{completedLevels}/{totalLevels} Levels</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: region.color
            }}
          />
        </div>
      </div>

      {/* Completed badge */}
      {region.completed && (
        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-success flex items-center justify-center">
          <svg className="w-4 h-4 text-success-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      )}
    </button>
  );
}

// Level selection panel
function LevelPanel({
  region,
  onSelectLevel
}: {
  region: Region;
  onSelectLevel: (levelId: string) => void;
}) {
  const { regionProgress } = useGameStore();
  const completedLevels = regionProgress[region.id]?.completedLevels || [];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: region.color }}
        />
        <h2 className="text-2xl font-bold text-foreground">{region.name}</h2>
      </div>

      <p className="text-muted-foreground mb-6">{region.description}</p>

      {/* Level list */}
      <div className="space-y-2">
        {region.levels.map((level, index) => {
          const previousLevel = index > 0 ? region.levels[index - 1] : null;
          const isLocked = previousLevel && !previousLevel.completed && index > 0 && !completedLevels.includes(level.id);
          const isBoss = level.boss !== undefined;

          return (
            <button
              key={level.id}
              onClick={() => !isLocked && onSelectLevel(level.id)}
              disabled={isLocked}
              className={cn(
                "w-full p-4 rounded-lg border transition-all text-left flex items-center gap-4",
                level.completed
                  ? "border-success/50 bg-success/10"
                  : isLocked
                    ? "border-muted bg-muted/30 opacity-50 cursor-not-allowed"
                    : "border-border bg-card hover:border-primary hover:bg-primary/10",
                isBoss && !isLocked && "border-destructive/50 bg-destructive/10 hover:border-destructive"
              )}
            >
              {/* Level number or lock */}
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg",
                level.completed
                  ? "bg-success text-success-foreground"
                  : isLocked
                    ? "bg-muted text-muted-foreground"
                    : isBoss
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-primary text-primary-foreground"
              )}>
                {isLocked ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                ) : isBoss ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>

              {/* Level info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-foreground">{level.name}</h4>
                  {isBoss && (
                    <span className="px-2 py-0.5 text-xs bg-destructive text-destructive-foreground rounded-full">
                      BOSS
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{level.description}</p>
              </div>

              {/* Stars */}
              {level.completed && (
                <div className="flex gap-0.5">
                  {[1, 2, 3].map((star) => (
                    <svg
                      key={star}
                      className={cn(
                        "w-5 h-5",
                        star <= level.stars ? "text-warning" : "text-muted"
                      )}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
              )}

              {/* Rewards preview */}
              {!level.completed && !isLocked && (
                <div className="text-right text-sm">
                  <div className="text-gold">+{level.rewards.gold} Gold</div>
                  <div className="text-experience">+{level.rewards.experience} XP</div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Player stats header
function PlayerHeader() {
  const { progress, setScreen } = useGameStore();

  const expPercent = (progress.experience / progress.experienceToNext) * 100;

  return (
    <div className="bg-card border-b border-border p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Player info */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
            {progress.level}
          </div>
          <div>
            <div className="font-semibold text-foreground">Level {progress.level}</div>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-experience transition-all"
                  style={{ width: `${expPercent}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {progress.experience}/{progress.experienceToNext} XP
              </span>
            </div>
          </div>
        </div>

        {/* Gold and quick actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg">
            <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center">
              <span className="text-gold font-bold text-sm">G</span>
            </div>
            <span className="font-semibold">{progress.gold}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setScreen('character-select')}
          >
            Characters
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setScreen('inventory')}
          >
            Inventory
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setScreen('shop')}
          >
            Shop
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setScreen('settings')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function WorldMapView() {
  const { regions, progress, startCombat, setScreen, selectRegion } = useGameStore();
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(
    regions.find(r => r.id === progress.currentRegion) || regions[0]
  );

  const handleSelectRegion = (region: Region) => {
    setSelectedRegion(region);
    selectRegion(region.id);
  };

  const handleSelectLevel = (levelId: string) => {
    startCombat(levelId);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PlayerHeader />

      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-6">World Map</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Region selection */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-muted-foreground">Regions</h2>
              <div className="space-y-3">
                {regions.map((region) => (
                  <RegionCard
                    key={region.id}
                    region={region}
                    isSelected={selectedRegion?.id === region.id}
                    onSelect={() => handleSelectRegion(region)}
                  />
                ))}
              </div>
            </div>

            {/* Level selection */}
            <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
              {selectedRegion ? (
                <LevelPanel
                  region={selectedRegion}
                  onSelectLevel={handleSelectLevel}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Select a region to view levels
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
