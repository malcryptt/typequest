// Game Data Types

export type CharacterClass = 'knight' | 'mage' | 'rogue' | 'ranger';

export interface CharacterStats {
  maxHealth: number;
  maxMana: number;
  attack: number;
  defense: number;
  speed: number;
  critChance: number;
  critDamage: number;
}

export interface ActiveEffect {
  type: 'stun' | 'buff' | 'debuff' | 'dot' | 'heal';
  value: number;
  duration: number; // Duration in turns relative to attack cycles
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed';
  progress: number;
  target?: number;
}

export interface Character {
  id: CharacterClass;
  name: string;
  title: string;
  description: string;
  backstory: string;
  stats: CharacterStats;
  abilities: Ability[];
  color: string;
  unlocked: boolean;
  unlockRequirement?: string;
}

export interface Ability {
  id: string;
  name: string;
  description: string;
  manaCost: number;
  cooldown: number;
  damage: number;
  effect?: 'heal' | 'buff' | 'debuff' | 'dot' | 'stun';
  effectValue?: number;
  requiredLevel: number;
}

export interface Enemy {
  id: string;
  name: string;
  title?: string;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  words: string[];
  isBoss: boolean;
  rewards: {
    gold: number;
    experience: number;
    items?: string[];
  };
  color: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: 'weapon' | 'armor' | 'helmet' | 'boots' | 'ring' | 'amulet' | 'offhand' | 'consumable' | 'key' | 'accessory';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  stats?: Partial<CharacterStats>;
  effect?: string;
  value: number;
  icon: string;
}

export interface InventoryItem extends Item {
  quantity: number;
  equipped?: boolean;
}

export interface Region {
  id: string;
  name: string;
  description: string;
  requiredLevel: number;
  levels: Level[];
  unlocked: boolean;
  completed: boolean;
  environment: 'forest' | 'mountains' | 'swamp' | 'castle' | 'volcano';
  color: string;
}

export interface Level {
  id: string;
  name: string;
  description: string;
  enemies: Enemy[];
  boss?: Enemy;
  rewards: {
    gold: number;
    experience: number;
    items?: string[];
  };
  completed: boolean;
  stars: number; // 0-3 based on performance
  dialogue?: DialogueNode[];
}

export interface DialogueNode {
  id: string;
  speaker: string;
  portrait?: string;
  text: string;
  choices?: DialogueChoice[];
  next?: string;
}

export interface DialogueChoice {
  text: string;
  nextId: string;
  effect?: {
    type: 'reputation' | 'item' | 'gold' | 'unlock';
    value: string | number;
  };
}

export interface CombatState {
  isActive: boolean;
  currentEnemy: Enemy | null;
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
  isRaging: boolean;
  shieldWord: string | null;
  shieldTypedChars: string;
  bossCorrectWords: number;
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

export interface PlayerProgress {
  level: number;
  experience: number;
  experienceToNext: number;
  gold: number;
  currentCharacter: CharacterClass;
  unlockedCharacters: CharacterClass[];
  inventory: InventoryItem[];
  equipment: {
    weapon?: string;
    armor?: string;
    helmet?: string;
    boots?: string;
    ring?: string;
    amulet?: string;
    offhand?: string;
  };
  completedLevels: string[];
  achievements: string[];
  statistics: GameStatistics;
  currentRegion: string;
  currentLevel: string | null;
}

export interface GameStatistics {
  totalWordsTyped: number;
  totalCharsTyped: number;
  averageWpm: number;
  averageAccuracy: number;
  highestWpm: number;
  highestCombo: number;
  enemiesDefeated: number;
  bossesDefeated: number;
  totalGoldEarned: number;
  totalDamageDealt: number;
  totalDamageTaken: number;
  totalHealing: number;
  timePlayed: number;
  gamesPlayed: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  reward?: {
    type: 'gold' | 'item' | 'character';
    value: string | number;
  };
  unlocked: boolean;
}

export type GameScreen =
  | 'main-menu'
  | 'character-select'
  | 'world-map'
  | 'combat'
  | 'inventory'
  | 'shop'
  | 'dialogue'
  | 'level-complete'
  | 'game-over'
  | 'settings'
  | 'achievements'
  | 'statistics';

export interface GameSettings {
  musicVolume: number;
  sfxVolume: number;
  showDamageNumbers: boolean;
  showWpmCounter: boolean;
  difficulty: 'easy' | 'normal' | 'hard';
  autoSave: boolean;
}
