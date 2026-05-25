'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { LowPolyCharacter } from './3d/LowPolyCharacter';
import { LowPolyEnemy } from './3d/LowPolyEnemy';
import { CombatArena } from './3d/CombatArena';
import { useGameStore } from '@/lib/game/store';
import { getCharacter } from '@/lib/game/characters';
import { cn } from '@/lib/utils';
import { ParallaxBackground } from './cinematic/parallax-background';
import { HudPanel, StatDisplay } from './cinematic/hud-panel';
import { WordDisplay } from './cinematic/word-display';
import { Heart, Zap, Target, Activity, Flame, Swords } from 'lucide-react';

function CombatScene() {
  const { combat, progress, regions } = useGameStore();
  const [playerAttacking, setPlayerAttacking] = useState(false);
  const [enemyAttacking, setEnemyAttacking] = useState(false);
  const [playerHurt, setPlayerHurt] = useState(false);
  const [enemyHurt, setEnemyHurt] = useState(false);

  const character = getCharacter(progress.currentCharacter);
  const region = regions.find(r => r.levels.some(l => l.id === progress.currentLevel));
  const environment = region?.environment || 'forest';

  // Track damage for animations
  const [lastEnemyHealth, setLastEnemyHealth] = useState(combat.enemyHealth);
  const [lastPlayerHealth, setLastPlayerHealth] = useState(combat.playerHealth);

  useEffect(() => {
    if (combat.enemyHealth < lastEnemyHealth) {
      setPlayerAttacking(true);
      setEnemyHurt(true);
      setTimeout(() => {
        setPlayerAttacking(false);
        setEnemyHurt(false);
      }, 300);
    }
    setLastEnemyHealth(combat.enemyHealth);
  }, [combat.enemyHealth, lastEnemyHealth]);

  useEffect(() => {
    if (combat.playerHealth < lastPlayerHealth) {
      setEnemyAttacking(true);
      setPlayerHurt(true);
      setTimeout(() => {
        setEnemyAttacking(false);
        setPlayerHurt(false);
      }, 300);
    }
    setLastPlayerHealth(combat.playerHealth);
  }, [combat.playerHealth, lastPlayerHealth]);

  if (!character) return null;

  return (
    <>
      <CombatArena environment={environment} />

      {/* Player character */}
      <LowPolyCharacter
        characterClass={progress.currentCharacter}
        position={[-1.5, 0, 1]}
        rotation={[0, 0.3, 0]}
        scale={1.2}
        isAttacking={playerAttacking}
        isHurt={playerHurt}
        isIdle={!playerAttacking && !playerHurt}
      />

      {/* Enemy */}
      {combat.currentEnemy && (
        <LowPolyEnemy
          enemy={combat.currentEnemy}
          position={[1.5, 0, -1]}
          rotation={[0, Math.PI - 0.3, 0]}
          scale={combat.currentEnemy.isBoss ? 1.4 : 1}
          isAttacking={enemyAttacking}
          isHurt={enemyHurt}
          healthPercent={(combat.enemyHealth / combat.currentEnemy.maxHealth) * 100}
        />
      )}

      {/* Camera controls - limited for gameplay */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.5}
        minAzimuthAngle={-Math.PI / 6}
        maxAzimuthAngle={Math.PI / 6}
        target={[0, 0.5, 0]}
      />
    </>
  );
}

// Damage number floating display
function DamageNumbers() {
  const { combat } = useGameStore();

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {combat.damageNumbers.map((dmg) => (
        <div
          key={dmg.id}
          className={cn(
            "absolute font-bold text-2xl animate-bounce",
            dmg.isCrit ? "text-yellow-400 text-3xl" : "",
            dmg.isHeal ? "text-green-400" : "",
            !dmg.isHeal && !dmg.isCrit ? "text-red-400" : ""
          )}
          style={{
            left: `${dmg.x}%`,
            top: `${dmg.y}%`,
            animation: 'floatUp 1s ease-out forwards',
          }}
        >
          {dmg.isHeal ? '+' : '-'}{dmg.value}
          {dmg.isCrit && ' CRIT!'}
        </div>
      ))}
    </div>
  );
}

// Health and mana bars
function StatBars() {
  const { combat, progress } = useGameStore();
  const character = getCharacter(progress.currentCharacter);

  if (!character) return null;

  const healthPercent = (combat.playerHealth / character.stats.maxHealth) * 100;
  const manaPercent = (combat.playerMana / character.stats.maxMana) * 100;
  const enemyHealthPercent = combat.currentEnemy
    ? (combat.enemyHealth / combat.currentEnemy.maxHealth) * 100
    : 0;

  return (
    <div className="absolute top-4 left-4 right-4 flex justify-between items-start gap-4 z-20 pointer-events-none">
      {/* Player stats */}
      <HudPanel className="flex flex-col gap-3 min-w-48" style={{ background: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center text-lg font-bold shadow-lg"
            style={{ backgroundColor: character.color }}
          >
            {character.name[0]}
          </div>
          <div>
            <div className="text-sm font-bold text-foreground tracking-wide">{character.name}</div>
            <div className="text-xs text-muted-foreground tracking-widest uppercase">LVL {progress.level}</div>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <StatDisplay icon={<Heart className="fill-current" />} value={Math.ceil(combat.playerHealth)} label="HP" accentColor="var(--health)" />
          <StatDisplay icon={<Zap className="fill-current" />} value={Math.ceil(combat.playerMana)} label="MP" accentColor="var(--mana)" />
        </div>
      </HudPanel>

      {/* Combat stats */}
      <HudPanel className="flex items-center gap-6" style={{ background: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}>
        <StatDisplay icon={<Activity />} value={combat.wpm} label="WPM" accentColor="var(--world-accent-color)" />
        <StatDisplay icon={<Target />} value={combat.accuracy} label="ACC" accentColor="var(--correct-color)" />
        <StatDisplay icon={<Flame className="fill-current" />} value={combat.combo} label="COMBO" accentColor="var(--warning)" />
      </HudPanel>

      {/* Enemy stats */}
      {combat.currentEnemy ? (
        <HudPanel className="flex flex-col gap-3 min-w-48 items-end" style={{ background: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-bold text-foreground tracking-wide">{combat.currentEnemy.name}</div>
              {combat.currentEnemy.title && (
                <div className="text-xs text-muted-foreground tracking-widest uppercase">{combat.currentEnemy.title}</div>
              )}
            </div>
            <div
              className={cn(
                "w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg font-bold shadow-lg",
                combat.currentEnemy.isBoss ? "border-destructive" : "border-muted"
              )}
              style={{ backgroundColor: combat.currentEnemy.color }}
            >
              {combat.currentEnemy.isBoss ? 'B' : 'E'}
            </div>
          </div>
          <div className="w-full flex justify-end mt-2">
            <StatDisplay icon={<Swords className="fill-current" />} value={Math.ceil(combat.enemyHealth)} label="HP" accentColor={combat.currentEnemy.isBoss ? 'var(--destructive)' : 'var(--wrong-color)'} />
          </div>
        </HudPanel>
      ) : <div className="w-48" />}
    </div>
  );
}

// Typing input display
function TypingDisplay() {
  const { combat, typeCharacter, enemyAttack } = useGameStore();

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!combat.isActive || !combat.currentWord) return;

      // Ignore special keys
      if (e.key.length !== 1) return;

      typeCharacter(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [combat.isActive, combat.currentWord, typeCharacter]);

  // Enemy attack timer
  useEffect(() => {
    if (!combat.isActive || !combat.currentEnemy) return;

    const attackInterval = setInterval(() => {
      enemyAttack();
    }, 3000); // Enemy attacks every 3 seconds

    return () => clearInterval(attackInterval);
  }, [combat.isActive, combat.currentEnemy, enemyAttack]);

  if (!combat.currentWord) return null;

  return (
    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6 z-20 w-full pointer-events-none">
      <WordDisplay word={combat.currentWord} typedChars={combat.typedChars} />
      <div className="bg-background/40 backdrop-blur-md px-6 py-2 rounded-full border border-border/50">
        <p className="text-sm text-foreground/80 tracking-wider">
          Type the word to attack! Speed and accuracy increase damage.
        </p>
      </div>
    </div>
  );
}

// Abilities bar
function AbilitiesBar() {
  const { combat, progress, useAbility } = useGameStore();
  const character = getCharacter(progress.currentCharacter);

  if (!character) return null;

  const availableAbilities = character.abilities.filter(a => a.requiredLevel <= progress.level);

  return (
    <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-2">
      {availableAbilities.map((ability, index) => {
        const isOnCooldown = combat.abilityCooldowns[ability.id] > Date.now();
        const cooldownRemaining = isOnCooldown
          ? Math.ceil((combat.abilityCooldowns[ability.id] - Date.now()) / 1000)
          : 0;
        const canAfford = combat.playerMana >= ability.manaCost;

        return (
          <button
            key={ability.id}
            onClick={() => useAbility(ability.id)}
            disabled={isOnCooldown || !canAfford || !combat.isActive}
            className={cn(
              "relative w-14 h-14 rounded-lg border-2 flex flex-col items-center justify-center transition-all",
              "hover:scale-105 active:scale-95",
              isOnCooldown || !canAfford
                ? "border-muted bg-muted/50 opacity-50 cursor-not-allowed"
                : "border-primary bg-card hover:bg-primary/20 cursor-pointer"
            )}
            title={`${ability.name} - ${ability.description} (${ability.manaCost} MP)`}
          >
            <span className="text-lg font-bold">{index + 1}</span>
            <span className="text-xs truncate max-w-12">{ability.name.split(' ')[0]}</span>

            {/* Cooldown overlay */}
            {isOnCooldown && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg">
                <span className="text-lg font-bold">{cooldownRemaining}</span>
              </div>
            )}

            {/* Mana cost indicator */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs text-mana">
              {ability.manaCost}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// Battle log
function BattleLog() {
  const { combat } = useGameStore();

  return (
    <div className="absolute bottom-4 left-4 w-64 max-h-32 overflow-y-auto bg-card/80 backdrop-blur rounded-lg border border-border p-2">
      <div className="text-xs space-y-1">
        {combat.battleLog.slice(-5).map((entry) => (
          <div
            key={entry.id}
            className={cn(
              "opacity-80",
              entry.type === 'damage' && "text-success",
              entry.type === 'heal' && "text-green-400",
              entry.type === 'ability' && "text-mana",
              entry.type === 'enemy' && "text-destructive",
              entry.type === 'system' && "text-muted-foreground italic"
            )}
          >
            {entry.text}
          </div>
        ))}
      </div>
    </div>
  );
}

// Menu buttons
function CombatMenu() {
  const { setScreen, combat } = useGameStore();

  return (
    <div className="absolute top-4 right-4 flex gap-2">
      <button
        onClick={() => setScreen('inventory')}
        className="px-3 py-1 bg-card/80 backdrop-blur border border-border rounded-lg text-sm hover:bg-card transition-colors"
      >
        Inventory
      </button>
      <button
        onClick={() => {
          if (confirm('Are you sure you want to flee? You will lose this battle.')) {
            setScreen('world-map');
          }
        }}
        className="px-3 py-1 bg-destructive/80 backdrop-blur border border-destructive rounded-lg text-sm hover:bg-destructive transition-colors text-destructive-foreground"
      >
        Flee
      </button>
    </div>
  );
}

export function CombatView() {
  return (
    <div className="relative w-full h-screen bg-background overflow-hidden select-none">
      {/* Cinematic Level Parallax Background */}
      <ParallaxBackground />

      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 3, 6], fov: 50 }}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      >
        <Suspense fallback={null}>
          <CombatScene />
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-auto">
        <StatBars />
        <TypingDisplay />
        <AbilitiesBar />
        <DamageNumbers />
        <BattleLog />
        <CombatMenu />
      </div>

      {/* Floating animation keyframes */}
      <style jsx global>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-50px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
