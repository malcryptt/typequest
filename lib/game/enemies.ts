// Enemy Data and Word Lists

// Word lists by difficulty
export const WORD_LISTS = {
  easy: [
    'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had',
    'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his',
    'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who',
    'boy', 'did', 'own', 'say', 'she', 'too', 'use', 'cat', 'dog', 'run',
    'big', 'red', 'sun', 'man', 'top', 'pen', 'cup', 'hat', 'bat', 'map',
  ],
  medium: [
    'about', 'above', 'after', 'again', 'along', 'began', 'below', 'being',
    'bring', 'carry', 'clean', 'close', 'could', 'earth', 'every', 'first',
    'found', 'great', 'group', 'heard', 'house', 'large', 'learn', 'leave',
    'light', 'might', 'never', 'night', 'often', 'other', 'paper', 'place',
    'plant', 'point', 'right', 'river', 'round', 'school', 'shall', 'small',
    'sound', 'spell', 'start', 'still', 'story', 'study', 'their', 'there',
    'thing', 'think', 'those', 'three', 'today', 'under', 'until', 'water',
    'where', 'which', 'while', 'world', 'would', 'write', 'young', 'sword',
  ],
  hard: [
    'adventure', 'beautiful', 'challenge', 'dangerous', 'excellent', 'fantastic',
    'gathering', 'happiness', 'important', 'knowledge', 'legendary', 'mysterious',
    'necessary', 'obligation', 'particular', 'questioned', 'remarkable', 'situation',
    'throughout', 'understand', 'vocabulary', 'wilderness', 'yesterday', 'accomplished',
    'battlefield', 'catastrophe', 'destruction', 'enchantment', 'fortification',
  ],
  fantasy: [
    'dragon', 'wizard', 'knight', 'castle', 'throne', 'kingdom', 'warrior', 'potion',
    'magic', 'spell', 'quest', 'dungeon', 'treasure', 'armor', 'shield', 'sword',
    'archer', 'rogue', 'mage', 'ranger', 'goblin', 'troll', 'ogre', 'demon',
    'phoenix', 'griffin', 'unicorn', 'chimera', 'basilisk', 'hydra', 'wyrm',
    'sorcery', 'enchant', 'mystical', 'ancient', 'prophecy', 'destiny', 'legend',
  ],
  boss: [
    'annihilation', 'overwhelming', 'indestructible', 'unprecedented', 'extraordinary',
    'incomprehensible', 'unquestionable', 'revolutionary', 'metamorphosis', 'transcendence',
  ],
};

const getWordsForDifficulty = (difficulty: 'easy' | 'medium' | 'hard' | 'boss'): string[] => {
  const words = [...WORD_LISTS[difficulty], ...WORD_LISTS.fantasy];
  return words;
};

export interface EnemyData {
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

// All enemies as a dictionary for easy lookup
export const ENEMIES: Record<string, EnemyData> = {
  // Verdant Vale enemies
  'forest-sprite': {
    id: 'forest-sprite',
    name: 'Forest Sprite',
    health: 50,
    maxHealth: 50,
    attack: 8,
    defense: 2,
    words: getWordsForDifficulty('easy'),
    isBoss: false,
    rewards: { gold: 10, experience: 15 },
    color: '#81c784',
  },
  'wild-boar': {
    id: 'wild-boar',
    name: 'Wild Boar',
    health: 70,
    maxHealth: 70,
    attack: 12,
    defense: 5,
    words: getWordsForDifficulty('easy'),
    isBoss: false,
    rewards: { gold: 15, experience: 20 },
    color: '#8d6e63',
  },
  'goblin-scout': {
    id: 'goblin-scout',
    name: 'Goblin Scout',
    health: 60,
    maxHealth: 60,
    attack: 10,
    defense: 3,
    words: getWordsForDifficulty('easy'),
    isBoss: false,
    rewards: { gold: 12, experience: 18 },
    color: '#9ccc65',
  },
  'thornwood-treant': {
    id: 'thornwood-treant',
    name: 'Thornwood Treant',
    title: 'Guardian of the Grove',
    health: 200,
    maxHealth: 200,
    attack: 20,
    defense: 15,
    words: getWordsForDifficulty('medium'),
    isBoss: true,
    rewards: { gold: 100, experience: 150, items: ['treant-bark-shield'] },
    color: '#558b2f',
  },

  // Misty Marshes enemies
  'swamp-lurker': {
    id: 'swamp-lurker',
    name: 'Swamp Lurker',
    health: 80,
    maxHealth: 80,
    attack: 15,
    defense: 6,
    words: getWordsForDifficulty('medium'),
    isBoss: false,
    rewards: { gold: 20, experience: 30 },
    color: '#5d4037',
  },
  'venomous-toad': {
    id: 'venomous-toad',
    name: 'Venomous Toad',
    health: 65,
    maxHealth: 65,
    attack: 18,
    defense: 4,
    words: getWordsForDifficulty('medium'),
    isBoss: false,
    rewards: { gold: 18, experience: 28 },
    color: '#7cb342',
  },
  'marsh-witch': {
    id: 'marsh-witch',
    name: 'Marsh Witch',
    health: 90,
    maxHealth: 90,
    attack: 22,
    defense: 8,
    words: getWordsForDifficulty('medium'),
    isBoss: false,
    rewards: { gold: 25, experience: 35 },
    color: '#6a1b9a',
  },
  'hydra-spawn': {
    id: 'hydra-spawn',
    name: 'Hydra Spawn',
    title: 'Terror of the Depths',
    health: 350,
    maxHealth: 350,
    attack: 30,
    defense: 20,
    words: getWordsForDifficulty('hard'),
    isBoss: true,
    rewards: { gold: 200, experience: 300, items: ['hydra-scale-mail'] },
    color: '#1565c0',
  },

  // Frostpeak enemies
  'frost-wolf': {
    id: 'frost-wolf',
    name: 'Frost Wolf',
    health: 100,
    maxHealth: 100,
    attack: 20,
    defense: 10,
    words: getWordsForDifficulty('medium'),
    isBoss: false,
    rewards: { gold: 30, experience: 45 },
    color: '#90caf9',
  },
  'ice-elemental': {
    id: 'ice-elemental',
    name: 'Ice Elemental',
    health: 120,
    maxHealth: 120,
    attack: 25,
    defense: 15,
    words: getWordsForDifficulty('hard'),
    isBoss: false,
    rewards: { gold: 35, experience: 50 },
    color: '#4fc3f7',
  },
  'mountain-yeti': {
    id: 'mountain-yeti',
    name: 'Mountain Yeti',
    health: 150,
    maxHealth: 150,
    attack: 28,
    defense: 18,
    words: getWordsForDifficulty('hard'),
    isBoss: false,
    rewards: { gold: 40, experience: 60 },
    color: '#e0e0e0',
  },
  'frost-wyrm': {
    id: 'frost-wyrm',
    name: 'Glacius',
    title: 'The Frost Wyrm',
    health: 500,
    maxHealth: 500,
    attack: 40,
    defense: 25,
    words: getWordsForDifficulty('boss'),
    isBoss: true,
    rewards: { gold: 350, experience: 500, items: ['wyrm-fang-blade'] },
    color: '#29b6f6',
  },

  // Shadow Citadel enemies
  'skeleton-warrior': {
    id: 'skeleton-warrior',
    name: 'Skeleton Warrior',
    health: 130,
    maxHealth: 130,
    attack: 25,
    defense: 12,
    words: getWordsForDifficulty('hard'),
    isBoss: false,
    rewards: { gold: 45, experience: 70 },
    color: '#d7ccc8',
  },
  'dark-cultist': {
    id: 'dark-cultist',
    name: 'Dark Cultist',
    health: 110,
    maxHealth: 110,
    attack: 30,
    defense: 8,
    words: getWordsForDifficulty('hard'),
    isBoss: false,
    rewards: { gold: 50, experience: 75 },
    color: '#4a148c',
  },
  'phantom-knight': {
    id: 'phantom-knight',
    name: 'Phantom Knight',
    health: 180,
    maxHealth: 180,
    attack: 35,
    defense: 22,
    words: getWordsForDifficulty('hard'),
    isBoss: false,
    rewards: { gold: 55, experience: 85 },
    color: '#7e57c2',
  },
  'lich-king': {
    id: 'lich-king',
    name: 'Malachar',
    title: 'The Lich King',
    health: 700,
    maxHealth: 700,
    attack: 50,
    defense: 30,
    words: getWordsForDifficulty('boss'),
    isBoss: true,
    rewards: { gold: 500, experience: 750, items: ['lich-crown'] },
    color: '#311b92',
  },

  // Dragon's Peak enemies
  'lava-golem': {
    id: 'lava-golem',
    name: 'Lava Golem',
    health: 200,
    maxHealth: 200,
    attack: 35,
    defense: 25,
    words: getWordsForDifficulty('hard'),
    isBoss: false,
    rewards: { gold: 70, experience: 100 },
    color: '#ff7043',
  },
  'fire-drake': {
    id: 'fire-drake',
    name: 'Fire Drake',
    health: 220,
    maxHealth: 220,
    attack: 40,
    defense: 20,
    words: getWordsForDifficulty('hard'),
    isBoss: false,
    rewards: { gold: 80, experience: 120 },
    color: '#f4511e',
  },
  'infernal-demon': {
    id: 'infernal-demon',
    name: 'Infernal Demon',
    health: 250,
    maxHealth: 250,
    attack: 45,
    defense: 28,
    words: getWordsForDifficulty('boss'),
    isBoss: false,
    rewards: { gold: 90, experience: 140 },
    color: '#d32f2f',
  },
  'ancient-dragon': {
    id: 'ancient-dragon',
    name: 'Ignaroth',
    title: 'The World Ender',
    health: 1000,
    maxHealth: 1000,
    attack: 60,
    defense: 35,
    words: getWordsForDifficulty('boss'),
    isBoss: true,
    rewards: { gold: 1000, experience: 1500, items: ['dragonheart-amulet', 'flame-tongue-sword'] },
    color: '#b71c1c',
  },
};

export const getEnemy = (id: string): EnemyData | undefined => {
  return ENEMIES[id];
};

export const getRandomWord = (enemy: EnemyData): string => {
  const words = enemy.words.length > 0 ? enemy.words : WORD_LISTS.medium;
  return words[Math.floor(Math.random() * words.length)];
};

export const VERDANT_VALE_ENEMIES = [
  ENEMIES['forest-sprite'],
  ENEMIES['wild-boar'],
  ENEMIES['goblin-scout'],
  ENEMIES['thornwood-treant'],
];

export const MISTY_MARSHES_ENEMIES = [
  ENEMIES['swamp-lurker'],
  ENEMIES['venomous-toad'],
  ENEMIES['marsh-witch'],
  ENEMIES['hydra-spawn'],
];

export const FROSTPEAK_ENEMIES = [
  ENEMIES['frost-wolf'],
  ENEMIES['ice-elemental'],
  ENEMIES['mountain-yeti'],
  ENEMIES['frost-wyrm'],
];

export const SHADOW_CITADEL_ENEMIES = [
  ENEMIES['skeleton-warrior'],
  ENEMIES['dark-cultist'],
  ENEMIES['phantom-knight'],
  ENEMIES['lich-king'],
];

export const DRAGONS_PEAK_ENEMIES = [
  ENEMIES['lava-golem'],
  ENEMIES['fire-drake'],
  ENEMIES['infernal-demon'],
  ENEMIES['ancient-dragon'],
];
