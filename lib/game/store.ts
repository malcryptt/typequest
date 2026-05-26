// Main Game Store using Zustand - Unified Implementation
import { create } from 'zustand';
import { CHARACTERS, CharacterData } from './characters';
import { REGIONS } from './regions';
import type { Level, Item, Quest, ActiveEffect } from './types';
import { ITEMS } from './items';
import { EnemyData, getRandomWord, ENEMIES } from './enemies';

// Game State Types
export type GameState =
  | 'mainMenu'
  | 'townHub'
  | 'worldMap'
  | 'combat'
  | 'inventory'
  | 'shop'
  | 'levelComplete'
  | 'gameOver';

export interface Player {
  name: string;
  characterId: string;
  level: number;
  experience: number;
  experienceToNext: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  attack: number;
  defense: number;
  speed: number;
  critChance: number;
  gold: number;
  quests: Record<string, Quest>;
}

export interface CombatState {
  isActive: boolean;
  currentEnemy: EnemyData | null;
  currentWord: string;
  typedChars: string;
  wpm: number;
  accuracy: number;
  combo: number;
  maxCombo: number;
  totalCharsTyped: number;
  correctChars: number;
  startTime: number | null;
  playerHealth: number;
  playerMana: number;
  enemyHealth: number;
  abilityCooldowns: Record<string, number>;
  activeEffects: ActiveEffect[];
  isEnraged: boolean;
  damageNumbers: DamageNumber[];
  battleLog: BattleLogEntry[];
  enemyIndex: number;
  totalEnemies: number;
}

export interface DamageNumber {
  id: string;
  value: number;
  x: number;
  y: number;
  isCrit: boolean;
  isHeal: boolean;
  isPlayerDamage: boolean;
}

export interface BattleLogEntry {
  id: string;
  text: string;
  type: 'damage' | 'heal' | 'ability' | 'enemy' | 'system';
  timestamp: number;
}

export interface Statistics {
  totalWordsTyped: number;
  totalCharactersTyped: number;
  averageWpm: number;
  bestWpm: number;
  averageAccuracy: number;
  bestAccuracy: number;
  battlesWon: number;
  battlesLost: number;
  totalDamageDealt: number;
  highestCombo: number;
  totalPlayTime: number;
}

export interface RegionProgress {
  [regionId: string]: {
    unlocked: boolean;
    completedLevels: string[];
    levelStars: Record<string, number>;
  };
}

interface GameStore {
  // Core State
  gameState: GameState;
  player: Player | null;
  combat: CombatState;
  inventory: Record<string, number>;
  equipment: {
    weapon: string | null;
    armor: string | null;
    accessory: string | null;
  };
  regionProgress: RegionProgress;
  currentLevel: Level | null;
  currentRegion: string;
  npcInteractions: Record<string, number>;
  statistics: Statistics;
  regions: typeof REGIONS;
  progress: { currentCharacter: string; level: number; currentLevel: string | null };

  // Actions
  setGameState: (state: GameState) => void;
  startNewGame: (characterId: string, playerName: string) => void;

  // Combat
  startCombat: (levelId: string) => void;
  typeCharacter: (char: string) => void;
  useAbility: (abilityId: string) => void;
  enemyAttack: () => void;
  nextEnemy: () => void;
  endCombat: (victory: boolean) => void;

  // Inventory
  addItem: (itemId: string, quantity?: number) => void;
  removeItem: (itemId: string, quantity?: number) => void;
  equipItem: (itemId: string) => void;
  unequipItem: (slot: 'weapon' | 'armor' | 'accessory') => void;
  useItem: (itemId: string) => void;

  // Progress
  addExperience: (amount: number) => void;
  levelUp: () => void;
  addGold: (amount: number) => void;
  completeLevel: (levelId: string, stars: number) => void;
  unlockRegion: (regionId: string) => void;

  // Quests
  startQuest: (questId: string, title: string, description: string, target?: number) => void;
  updateQuest: (questId: string, amount?: number) => void;
  completeQuest: (questId: string) => void;

  // NPCs
  recordNpcInteraction: (npcId: string) => void;

  // Save/Load
  saveGame: () => void;
  loadGame: () => void;
  hasSavedGame: () => boolean;

  // Utility
  setScreen: (screen: GameState) => void;
  selectRegion: (regionId: string) => void;
}

const DEFAULT_COMBAT: CombatState = {
  isActive: false,
  currentEnemy: null,
  currentWord: '',
  typedChars: '',
  wpm: 0,
  accuracy: 100,
  combo: 0,
  maxCombo: 0,
  totalCharsTyped: 0,
  correctChars: 0,
  startTime: null,
  playerHealth: 100,
  playerMana: 80,
  enemyHealth: 0,
  abilityCooldowns: {},
  activeEffects: [],
  isEnraged: false,
  damageNumbers: [],
  battleLog: [],
  enemyIndex: 0,
  totalEnemies: 0,
};

const DEFAULT_STATISTICS: Statistics = {
  totalWordsTyped: 0,
  totalCharactersTyped: 0,
  averageWpm: 0,
  bestWpm: 0,
  averageAccuracy: 0,
  bestAccuracy: 100,
  battlesWon: 0,
  battlesLost: 0,
  totalDamageDealt: 0,
  highestCombo: 0,
  totalPlayTime: 0,
};

const initializeRegionProgress = (): RegionProgress => {
  const progress: RegionProgress = {};
  REGIONS.forEach((region, index) => {
    progress[region.id] = {
      unlocked: index === 0, // First region unlocked by default
      completedLevels: [],
      levelStars: {},
    };
  });
  return progress;
};

const getExpForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

const calculateDamage = (
  baseAttack: number,
  wpm: number,
  accuracy: number,
  combo: number,
  critChance: number
): { damage: number; isCrit: boolean } => {
  const wpmBonus = Math.max(0, (wpm - 30) * 0.02);
  const accuracyMultiplier = 0.5 + (accuracy / 100);
  const comboBonus = Math.min(1, combo * 0.05);
  const isCrit = Math.random() * 100 < critChance;
  const critMultiplier = isCrit ? 2 : 1;

  const damage = Math.floor(
    baseAttack * (1 + wpmBonus) * accuracyMultiplier * (1 + comboBonus) * critMultiplier
  );

  return { damage: Math.max(1, damage), isCrit };
};

export const useGameStore = create<GameStore>()((set, get) => ({
  // Initial State
  gameState: 'mainMenu',
  player: null,
  combat: DEFAULT_COMBAT,
  inventory: {},
  equipment: { weapon: null, armor: null, accessory: null },
  regionProgress: initializeRegionProgress(),
  currentLevel: null,
  currentRegion: 'verdant_vale',
  npcInteractions: {},
  statistics: DEFAULT_STATISTICS,
  regions: REGIONS,
  progress: { currentCharacter: 'knight', level: 1, currentLevel: null },

  // Basic Actions
  setGameState: (state) => set({ gameState: state }),
  setScreen: (screen) => set({ gameState: screen }),
  selectRegion: (regionId) => set({ currentRegion: regionId }),

  // New Game
  startNewGame: (characterId, playerName) => {
    const character = CHARACTERS[characterId];
    if (!character) return;

    const player: Player = {
      name: playerName,
      characterId,
      level: 1,
      experience: 0,
      experienceToNext: 100,
      hp: character.baseStats.hp,
      maxHp: character.baseStats.hp,
      mp: character.baseStats.mp,
      maxMp: character.baseStats.mp,
      attack: character.baseStats.attack,
      defense: character.baseStats.defense,
      speed: character.baseStats.speed,
      critChance: character.baseStats.critChance,
      gold: 100,
      quests: {},
    };

    set({
      player,
      inventory: { health_potion: 3 },
      equipment: { weapon: null, armor: null, accessory: null },
      regionProgress: initializeRegionProgress(),
      statistics: DEFAULT_STATISTICS,
      progress: { currentCharacter: characterId, level: 1, currentLevel: null },
    });
  },

  // Combat System
  startCombat: (levelId) => {
    const state = get();
    if (!state.player) return;

    // Find the level
    let foundLevel: Level | null = null;
    let foundRegion: typeof REGIONS[0] | null = null;

    for (const region of REGIONS) {
      const level = region.levels.find(l => l.id === levelId);
      if (level) {
        foundLevel = level;
        foundRegion = region;
        break;
      }
    }

    if (!foundLevel || !foundRegion) return;

    // Get first enemy
    const firstEnemy = foundLevel.enemies[0];
    if (!firstEnemy) return;

    set({
      gameState: 'combat',
      currentLevel: foundLevel,
      currentRegion: foundRegion.id,
      progress: { ...state.progress, currentLevel: levelId },
      combat: {
        ...DEFAULT_COMBAT,
        isActive: true,
        currentEnemy: { ...firstEnemy },
        currentWord: getRandomWord(firstEnemy),
        playerHealth: state.player.maxHp,
        playerMana: state.player.maxMp,
        enemyHealth: firstEnemy.maxHealth,
        startTime: Date.now(),
        enemyIndex: 0,
        totalEnemies: foundLevel.enemies.length,
      },
    });
  },

  typeCharacter: (char) => {
    const state = get();
    if (!state.combat.isActive || !state.combat.currentEnemy || !state.player) return;

    const expectedChar = state.combat.currentWord[state.combat.typedChars.length];
    const isCorrect = char.toLowerCase() === expectedChar?.toLowerCase();

    const newTypedChars = state.combat.typedChars + char;
    const newTotalChars = state.combat.totalCharsTyped + 1;
    const newCorrectChars = state.combat.correctChars + (isCorrect ? 1 : 0);
    const newAccuracy = Math.round((newCorrectChars / newTotalChars) * 100);

    // Calculate WPM
    const elapsedMinutes = state.combat.startTime
      ? (Date.now() - state.combat.startTime) / 60000
      : 0.01;
    const wordsTyped = newCorrectChars / 5;
    const newWpm = Math.round(wordsTyped / Math.max(0.01, elapsedMinutes));

    // Update combo
    const newCombo = isCorrect ? state.combat.combo + 1 : 0;
    const newMaxCombo = Math.max(state.combat.maxCombo, newCombo);

    // Check if word is complete
    const wordComplete = isCorrect && newTypedChars.length >= state.combat.currentWord.length;

    let newCombat: Partial<CombatState> = {
      typedChars: wordComplete ? '' : newTypedChars,
      totalCharsTyped: newTotalChars,
      correctChars: newCorrectChars,
      accuracy: newAccuracy,
      wpm: newWpm,
      combo: newCombo,
      maxCombo: newMaxCombo,
    };

    // Deal damage on word completion
    if (wordComplete && state.combat.currentEnemy) {
      const { damage, isCrit } = calculateDamage(
        state.player.attack,
        newWpm,
        newAccuracy,
        newCombo,
        state.player.critChance
      );

      const newEnemyHealth = Math.max(0, state.combat.enemyHealth - damage);

      newCombat = {
        ...newCombat,
        currentWord: getRandomWord(state.combat.currentEnemy),
        enemyHealth: newEnemyHealth,
        damageNumbers: [
          ...state.combat.damageNumbers.slice(-5),
          {
            id: Date.now().toString(),
            value: damage,
            x: 60 + Math.random() * 20 - 10,
            y: 30 + Math.random() * 10,
            isCrit,
            isHeal: false,
            isPlayerDamage: false,
          },
        ],
        battleLog: [
          ...state.combat.battleLog.slice(-9),
          {
            id: Date.now().toString(),
            text: isCrit ? `CRITICAL! ${damage} damage!` : `${damage} damage!`,
            type: 'damage',
            timestamp: Date.now(),
          },
        ],
      };

      // Update statistics
      set((s) => ({
        statistics: {
          ...s.statistics,
          totalWordsTyped: s.statistics.totalWordsTyped + 1,
          totalCharactersTyped: s.statistics.totalCharactersTyped + state.combat.currentWord.length,
          totalDamageDealt: s.statistics.totalDamageDealt + damage,
          bestWpm: Math.max(s.statistics.bestWpm, newWpm),
          highestCombo: Math.max(s.statistics.highestCombo, newMaxCombo),
        },
      }));

      // Check if enemy defeated
      if (newEnemyHealth <= 0) {
        setTimeout(() => get().nextEnemy(), 500);
      }
    }

    set({ combat: { ...state.combat, ...newCombat } });
  },

  useAbility: (abilityId) => {
    const state = get();
    if (!state.combat.isActive || !state.player) return;

    const character = CHARACTERS[state.player.characterId];
    if (!character) return;

    const ability = character.abilities.find(a => a.id === abilityId);
    if (!ability) return;

    // Check cooldown
    if (state.combat.abilityCooldowns[abilityId] > Date.now()) return;

    // Check mana
    if (state.combat.playerMana < ability.manaCost) return;

    // Apply ability effect
    let newPlayerHealth = state.combat.playerHealth;
    let newEnemyHealth = state.combat.enemyHealth;
    const newMana = state.combat.playerMana - ability.manaCost;
    let newActiveEffects = [...state.combat.activeEffects];

    if (ability.effect === 'heal' && ability.effectValue) {
      newPlayerHealth = Math.min(state.player.maxHp, newPlayerHealth + ability.effectValue);
    } else {
      // Deal damage
      let damage = ability.damage * (1 + state.player.level * 0.1);

      // Check if player has an attack buff
      const attackBuff = newActiveEffects.find(e => e.type === 'buff');
      if (attackBuff) damage *= (1 + attackBuff.value / 100);

      newEnemyHealth = Math.max(0, newEnemyHealth - damage);

      // Add combat effect (stun, dot, buff)
      if (ability.effect && ability.effect !== 'heal') {
        newActiveEffects.push({
          type: ability.effect,
          value: ability.effectValue || 0,
          duration: 3, // default 3 turns
        });
      }
    }

    set({
      combat: {
        ...state.combat,
        playerMana: newMana,
        playerHealth: newPlayerHealth,
        enemyHealth: newEnemyHealth,
        activeEffects: newActiveEffects,
        abilityCooldowns: {
          ...state.combat.abilityCooldowns,
          [abilityId]: Date.now() + ability.cooldown * 1000,
        },
        battleLog: [
          ...state.combat.battleLog.slice(-9),
          {
            id: Date.now().toString(),
            text: `Used ${ability.name}!`,
            type: 'ability',
            timestamp: Date.now(),
          },
        ],
      },
    });

    // Check if enemy defeated
    if (newEnemyHealth <= 0) {
      setTimeout(() => get().nextEnemy(), 500);
    }
  },

  enemyAttack: () => {
    const state = get();
    if (!state.combat.isActive || !state.combat.currentEnemy || !state.player) return;

    // Tick active effects
    const stunned = state.combat.activeEffects.some(e => e.type === 'stun');
    const newActiveEffects = state.combat.activeEffects
      .map(e => ({ ...e, duration: e.duration - 1 }))
      .filter(e => e.duration > 0);

    let isEnraged = state.combat.isEnraged;
    let logEntries = state.combat.battleLog.slice(-9);

    if (state.combat.currentEnemy.isBoss && !isEnraged && state.combat.enemyHealth <= state.combat.currentEnemy.maxHealth / 2) {
      isEnraged = true;
      logEntries.push({
        id: Date.now().toString() + 'enrage',
        text: `${state.combat.currentEnemy.name} becomes ENRAGED!`,
        type: 'system',
        timestamp: Date.now(),
      });
    }

    if (stunned) {
      set({
        combat: {
          ...state.combat,
          activeEffects: newActiveEffects,
          isEnraged,
          battleLog: [
            ...logEntries.slice(-8),
            {
              id: Date.now().toString(),
              text: `${state.combat.currentEnemy.name} is stunned and couldn't attack!`,
              type: 'system',
              timestamp: Date.now(),
            },
          ],
        },
      });
      return;
    }

    const enrageMultiplier = isEnraged ? 1.5 : 1;
    let rawAttack = state.combat.currentEnemy.attack * enrageMultiplier;

    // Check debuffs on enemy
    const debuff = newActiveEffects.find(e => e.type === 'debuff');
    if (debuff) rawAttack *= (1 - debuff.value / 100);

    const damage = Math.floor(Math.max(1, rawAttack - state.player.defense / 2));
    const newPlayerHealth = Math.max(0, state.combat.playerHealth - damage);

    logEntries.push({
      id: Date.now().toString(),
      text: `${state.combat.currentEnemy.name} attacks for ${damage}!`,
      type: 'enemy',
      timestamp: Date.now(),
    });

    set({
      combat: {
        ...state.combat,
        playerHealth: newPlayerHealth,
        activeEffects: newActiveEffects,
        isEnraged,
        damageNumbers: [
          ...state.combat.damageNumbers.slice(-5),
          {
            id: Date.now().toString(),
            value: damage,
            x: 20 + Math.random() * 20,
            y: 40 + Math.random() * 10,
            isCrit: false,
            isHeal: false,
            isPlayerDamage: true,
          },
        ],
        battleLog: logEntries.slice(-9),
      },
    });

    // Check if player defeated
    if (newPlayerHealth <= 0) {
      get().endCombat(false);
    }
  },

  nextEnemy: () => {
    const state = get();
    if (!state.currentLevel) return;

    const nextIndex = state.combat.enemyIndex + 1;

    // Check if all enemies defeated
    if (nextIndex >= state.currentLevel.enemies.length) {
      get().endCombat(true);
      return;
    }

    const nextEnemy = state.currentLevel.enemies[nextIndex];
    if (!nextEnemy) return;

    set({
      combat: {
        ...state.combat,
        currentEnemy: { ...nextEnemy },
        currentWord: getRandomWord(nextEnemy),
        enemyHealth: nextEnemy.maxHealth,
        enemyIndex: nextIndex,
        typedChars: '',
        activeEffects: [],
        isEnraged: false,
        battleLog: [
          ...state.combat.battleLog.slice(-9),
          {
            id: Date.now().toString(),
            text: `${nextEnemy.name} appears!`,
            type: 'system',
            timestamp: Date.now(),
          },
        ],
      },
    });
  },

  endCombat: (victory) => {
    const state = get();
    if (!state.currentLevel || !state.player) return;

    if (victory) {
      // Calculate stars based on accuracy
      const stars = state.combat.accuracy >= 95 ? 3 : state.combat.accuracy >= 80 ? 2 : 1;

      // Award rewards
      get().addGold(state.currentLevel.rewards.gold);
      get().addExperience(state.currentLevel.rewards.experience);
      get().completeLevel(state.currentLevel.id, stars);

      // Add reward items
      state.currentLevel.rewards.items?.forEach((itemId: string) => {
        get().addItem(itemId);
      });

      set({
        gameState: 'levelComplete',
        statistics: {
          ...state.statistics,
          battlesWon: state.statistics.battlesWon + 1,
          bestAccuracy: Math.max(state.statistics.bestAccuracy, state.combat.accuracy),
        },
      });
    } else {
      set({
        gameState: 'gameOver',
        statistics: {
          ...state.statistics,
          battlesLost: state.statistics.battlesLost + 1,
        },
      });
    }

    // Reset combat
    set({ combat: DEFAULT_COMBAT });

    // Auto-save
    get().saveGame();
  },

  // Inventory Management
  addItem: (itemId, quantity = 1) => {
    set((state) => ({
      inventory: {
        ...state.inventory,
        [itemId]: (state.inventory[itemId] || 0) + quantity,
      },
    }));
  },

  removeItem: (itemId, quantity = 1) => {
    set((state) => {
      const newQuantity = (state.inventory[itemId] || 0) - quantity;
      const newInventory = { ...state.inventory };
      if (newQuantity <= 0) {
        delete newInventory[itemId];
      } else {
        newInventory[itemId] = newQuantity;
      }
      return { inventory: newInventory };
    });
  },

  equipItem: (itemId) => {
    const item = ITEMS[itemId];
    if (!item || !item.type) return;

    set((state) => ({
      equipment: {
        ...state.equipment,
        [item.type as string]: itemId,
      },
    }));
  },

  unequipItem: (slot) => {
    set((state) => ({
      equipment: {
        ...state.equipment,
        [slot]: null,
      },
    }));
  },

  useItem: (itemId) => {
    const state = get();
    const item = ITEMS[itemId];
    if (!item || item.type !== 'consumable' || !state.player) return;

    // Apply effect
    if (item.effect && item.effect.startsWith('heal:')) {
      const effectValue = parseInt(item.effect.split(':')[1] || '0', 10);
      const newHp = Math.min(state.player.maxHp, state.player.hp + effectValue);
      set({ player: { ...state.player, hp: newHp } });
    }

    get().removeItem(itemId);
  },

  // Progress
  addExperience: (amount) => {
    set((state) => {
      if (!state.player) return state;

      let newExp = state.player.experience + amount;
      let newLevel = state.player.level;
      let newExpToNext = state.player.experienceToNext;
      let player = { ...state.player };

      const logEntries: BattleLogEntry[] = [];

      while (newExp >= newExpToNext) {
        newExp -= newExpToNext;
        newLevel += 1;
        newExpToNext = Math.floor(newExpToNext * 1.5); // Exponential scaling

        // Boost stats dynamically
        player.maxHp += 20;
        player.maxMp += 10;
        player.attack += 5;
        player.defense += 5;
        player.hp = player.maxHp;      // Heal on level up
        player.mp = player.maxMp;

        logEntries.push({
          id: Date.now().toString() + String(newLevel),
          text: `Level Up! Reached level ${newLevel}! Stats increased.`,
          type: 'system',
          timestamp: Date.now(),
        });
      }

      player.level = newLevel;
      player.experience = newExp;
      player.experienceToNext = newExpToNext;

      // Update battle log if leveling happened mid-combat
      const newCombat = logEntries.length > 0 && state.combat.isActive
        ? { ...state.combat, battleLog: [...state.combat.battleLog.slice(0, 10 - logEntries.length), ...logEntries] }
        : state.combat;

      return { player, combat: newCombat };
    });
  },

  levelUp: () => {
    // Explicit trigger if needed
    set((state) => {
      if (!state.player) return state;
      let player = { ...state.player };
      player.level += 1;
      player.maxHp += 20;
      player.maxMp += 10;
      player.attack += 5;
      player.defense += 5;
      player.hp = player.maxHp;
      player.mp = player.maxMp;
      player.experienceToNext = Math.floor(player.experienceToNext * 1.5);
      return { player };
    });
  },

  addGold: (amount) => {
    set((state) => ({
      player: state.player ? { ...state.player, gold: state.player.gold + amount } : null,
    }));
  },

  startQuest: (questId, title, description, target) => {
    set((state) => {
      if (!state.player) return state;
      return {
        player: {
          ...state.player,
          quests: {
            ...(state.player.quests || {}),
            [questId]: { id: questId, title, description, status: 'active', progress: 0, target }
          }
        }
      };
    });
  },

  updateQuest: (questId, amount = 1) => {
    set((state) => {
      if (!state.player || !state.player.quests || !state.player.quests[questId]) return state;
      const quest = state.player.quests[questId];
      if (quest.status === 'completed') return state;

      const newProgress = quest.progress + amount;
      const isComplete = quest.target ? newProgress >= quest.target : false;

      return {
        player: { ...state.player, quests: { ...state.player.quests, [questId]: { ...quest, progress: newProgress, status: isComplete ? 'completed' : 'active' } } }
      };
    });
  },

  completeQuest: (questId) => {
    set((state) => {
      if (!state.player || !state.player.quests || !state.player.quests[questId]) return state;
      return {
        player: { ...state.player, quests: { ...state.player.quests, [questId]: { ...state.player.quests[questId], status: 'completed', progress: state.player.quests[questId].target || 1 } } }
      };
    });
  },

  completeLevel: (levelId, stars) => {
    set((state) => {
      const regionId = Object.keys(state.regionProgress).find(rId => {
        const region = REGIONS.find(r => r.id === rId);
        return region?.levels.some(l => l.id === levelId);
      });

      if (!regionId) return state;

      const regionProg = state.regionProgress[regionId];
      const existingStars = regionProg.levelStars[levelId] || 0;

      const newCompletedLevels = regionProg.completedLevels.includes(levelId)
        ? regionProg.completedLevels
        : [...regionProg.completedLevels, levelId];

      const currentRegion = REGIONS.find(r => r.id === regionId);
      const newRegionProgress = { ...state.regionProgress };

      newRegionProgress[regionId] = {
        ...regionProg,
        completedLevels: newCompletedLevels,
        levelStars: {
          ...regionProg.levelStars,
          [levelId]: Math.max(existingStars, stars),
        },
      };

      // Check for region completion and unlock next regions based on map paths
      if (currentRegion && newCompletedLevels.length >= currentRegion.levels.length) {
        if (regionId === 'verdant-vale' && newRegionProgress['misty-marshes'])
          newRegionProgress['misty-marshes'].unlocked = true;
        if (regionId === 'misty-marshes') {
          if (newRegionProgress['frostpeak']) newRegionProgress['frostpeak'].unlocked = true;
          if (newRegionProgress['shadow-citadel']) newRegionProgress['shadow-citadel'].unlocked = true;
        }
        if ((regionId === 'frostpeak' || regionId === 'shadow-citadel') && newRegionProgress['dragons-peak']) {
          newRegionProgress['dragons-peak'].unlocked = true;
        }
      }

      return {
        regionProgress: newRegionProgress,
      };
    });
  },

  unlockRegion: (regionId) => {
    set((state) => ({
      regionProgress: {
        ...state.regionProgress,
        [regionId]: {
          ...state.regionProgress[regionId],
          unlocked: true,
        },
      },
    }));
  },

  // NPCs
  recordNpcInteraction: (npcId) => {
    set((state) => ({
      npcInteractions: {
        ...state.npcInteractions,
        [npcId]: (state.npcInteractions[npcId] || 0) + 1,
      },
    }));
  },

  // Save/Load
  saveGame: () => {
    if (typeof window === 'undefined') return;
    const state = get();
    const saveData = {
      player: state.player,
      inventory: state.inventory,
      equipment: state.equipment,
      regionProgress: state.regionProgress,
      npcInteractions: state.npcInteractions,
      statistics: state.statistics,
      currentRegion: state.currentRegion,
    };
    localStorage.setItem('typequest-save', JSON.stringify(saveData));
  },

  loadGame: () => {
    if (typeof window === 'undefined') return;
    const savedData = localStorage.getItem('typequest-save');
    if (!savedData) return;

    try {
      const data = JSON.parse(savedData);
      set({
        player: data.player,
        inventory: data.inventory || {},
        equipment: data.equipment || { weapon: null, armor: null, accessory: null },
        regionProgress: data.regionProgress || initializeRegionProgress(),
        npcInteractions: data.npcInteractions || {},
        statistics: data.statistics || DEFAULT_STATISTICS,
        currentRegion: data.currentRegion || 'verdant_vale',
        progress: data.player ? {
          currentCharacter: data.player.characterId,
          level: data.player.level,
          currentLevel: null,
        } : { currentCharacter: 'knight', level: 1, currentLevel: null },
      });
    } catch (e) {
      console.error('Failed to load game:', e);
    }
  },

  hasSavedGame: () => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('typequest-save') !== null;
  },
}));

// Helper to get character data
export function getCharacter(characterId: string): CharacterData | null {
  return CHARACTERS[characterId] || null;
}
