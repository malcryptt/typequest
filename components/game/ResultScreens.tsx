'use client';

import { useGameStore } from '@/lib/game/store';
import { getCharacter } from '@/lib/game/characters';
import { getItem } from '@/lib/game/items';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function LevelCompleteScreen() {
  const { progress, combat, regions, setScreen } = useGameStore();
  
  const character = getCharacter(progress.currentCharacter);
  const region = regions.find(r => r.levels.some(l => l.id === progress.currentLevel));
  const level = region?.levels.find(l => l.id === progress.currentLevel);
  
  if (!level || !character) return null;
  
  // Calculate stars based on accuracy
  const stars = combat.accuracy >= 95 ? 3 : combat.accuracy >= 80 ? 2 : 1;
  
  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur flex items-center justify-center z-50">
      <div className="max-w-lg w-full mx-4 bg-card border border-border rounded-2xl p-8 shadow-2xl">
        {/* Victory Banner */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Victory!</h1>
          <p className="text-muted-foreground">{level.name} Completed</p>
        </div>
        
        {/* Stars */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map((star) => (
            <div
              key={star}
              className={cn(
                "w-12 h-12 transition-all duration-500",
                star <= stars 
                  ? "text-warning scale-110" 
                  : "text-muted scale-90 opacity-30"
              )}
              style={{ 
                animationDelay: `${star * 0.2}s`,
                animation: star <= stars ? 'starPop 0.5s ease-out forwards' : 'none'
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
          ))}
        </div>
        
        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-secondary/50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-primary">{combat.wpm}</div>
            <div className="text-sm text-muted-foreground">Words Per Minute</div>
          </div>
          <div className="bg-secondary/50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-success">{combat.accuracy}%</div>
            <div className="text-sm text-muted-foreground">Accuracy</div>
          </div>
          <div className="bg-secondary/50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-warning">{combat.maxCombo}</div>
            <div className="text-sm text-muted-foreground">Max Combo</div>
          </div>
          <div className="bg-secondary/50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-foreground">{progress.statistics.totalDamageDealt}</div>
            <div className="text-sm text-muted-foreground">Total Damage</div>
          </div>
        </div>
        
        {/* Rewards */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-center">Rewards</h3>
          <div className="flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                <span className="text-gold font-bold">G</span>
              </div>
              <span className="text-lg font-semibold">+{level.rewards.gold}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-experience/20 flex items-center justify-center">
                <span className="text-experience font-bold">XP</span>
              </div>
              <span className="text-lg font-semibold">+{level.rewards.experience}</span>
            </div>
          </div>
          
          {/* Item rewards */}
          {level.rewards.items && level.rewards.items.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground text-center mb-2">Items Obtained:</p>
              <div className="flex justify-center gap-2 flex-wrap">
                {level.rewards.items.map((itemId) => {
                  const item = getItem(itemId);
                  if (!item) return null;
                  return (
                    <div
                      key={itemId}
                      className="px-3 py-1 bg-primary/20 border border-primary rounded-full text-sm"
                    >
                      {item.name}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setScreen('world-map')}
          >
            Return to Map
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              // Replay same level
              const store = useGameStore.getState();
              if (progress.currentLevel) {
                store.startCombat(progress.currentLevel);
              }
            }}
          >
            Play Again
          </Button>
        </div>
      </div>
      
      {/* Star animation styles */}
      <style jsx global>{`
        @keyframes starPop {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.3);
          }
          100% {
            transform: scale(1.1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export function GameOverScreen() {
  const { progress, combat, regions, setScreen, saveGame } = useGameStore();
  
  const character = getCharacter(progress.currentCharacter);
  const region = regions.find(r => r.levels.some(l => l.id === progress.currentLevel));
  const level = region?.levels.find(l => l.id === progress.currentLevel);
  
  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur flex items-center justify-center z-50">
      <div className="max-w-lg w-full mx-4 bg-card border border-destructive/50 rounded-2xl p-8 shadow-2xl">
        {/* Defeat Banner */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-destructive mb-2">Defeated</h1>
          <p className="text-muted-foreground">
            {combat.currentEnemy?.name || 'The enemy'} was too powerful...
          </p>
        </div>
        
        {/* Skull icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center">
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              className="w-12 h-12 text-destructive"
            >
              <circle cx="12" cy="10" r="7" />
              <circle cx="9" cy="9" r="1.5" fill="currentColor" />
              <circle cx="15" cy="9" r="1.5" fill="currentColor" />
              <path d="M9 14 L12 17 L15 14" />
              <path d="M10 20 L10 17" />
              <path d="M14 20 L14 17" />
            </svg>
          </div>
        </div>
        
        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-secondary/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-muted-foreground">{combat.wpm}</div>
            <div className="text-sm text-muted-foreground">Final WPM</div>
          </div>
          <div className="bg-secondary/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-muted-foreground">{combat.accuracy}%</div>
            <div className="text-sm text-muted-foreground">Accuracy</div>
          </div>
        </div>
        
        {/* Tip */}
        <div className="bg-muted/50 rounded-lg p-4 mb-8 text-center">
          <p className="text-sm text-muted-foreground">
            <strong>Tip:</strong> Try upgrading your equipment in the shop, 
            or practice to improve your typing speed and accuracy!
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setScreen('world-map')}
          >
            Return to Map
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={() => {
              if (progress.currentLevel) {
                useGameStore.getState().startCombat(progress.currentLevel);
              }
            }}
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
