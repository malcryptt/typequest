// Character Data

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

export interface CharacterData {
  id: string;
  name: string;
  title: string;
  description: string;
  backstory: string;
  baseStats: {
    hp: number;
    mp: number;
    attack: number;
    defense: number;
    speed: number;
    critChance: number;
    critDamage: number;
  };
  abilities: Ability[];
  color: string;
  unlocked: boolean;
  unlockRequirement?: string;
}

// Knight Abilities
const knightAbilities: Ability[] = [
  {
    id: 'shield-bash',
    name: 'Shield Bash',
    description: 'Stun the enemy briefly, reducing their attack speed',
    manaCost: 15,
    cooldown: 8,
    damage: 25,
    effect: 'stun',
    effectValue: 2,
    requiredLevel: 1,
  },
  {
    id: 'heroic-strike',
    name: 'Heroic Strike',
    description: 'A powerful overhead strike that deals massive damage',
    manaCost: 25,
    cooldown: 12,
    damage: 60,
    requiredLevel: 3,
  },
  {
    id: 'fortify',
    name: 'Fortify',
    description: 'Increase defense by 50% for the next 3 attacks',
    manaCost: 20,
    cooldown: 15,
    damage: 0,
    effect: 'buff',
    effectValue: 50,
    requiredLevel: 5,
  },
  {
    id: 'rallying-cry',
    name: 'Rallying Cry',
    description: 'Restore health and boost attack power',
    manaCost: 35,
    cooldown: 20,
    damage: 0,
    effect: 'heal',
    effectValue: 40,
    requiredLevel: 8,
  },
];

// Mage Abilities
const mageAbilities: Ability[] = [
  {
    id: 'fireball',
    name: 'Fireball',
    description: 'Launch a blazing fireball at the enemy',
    manaCost: 20,
    cooldown: 6,
    damage: 45,
    requiredLevel: 1,
  },
  {
    id: 'frost-nova',
    name: 'Frost Nova',
    description: 'Freeze the enemy, slowing their attacks',
    manaCost: 25,
    cooldown: 10,
    damage: 30,
    effect: 'debuff',
    effectValue: 3,
    requiredLevel: 3,
  },
  {
    id: 'arcane-missile',
    name: 'Arcane Missiles',
    description: 'Fire three homing missiles that always hit',
    manaCost: 30,
    cooldown: 8,
    damage: 55,
    requiredLevel: 5,
  },
  {
    id: 'meteor',
    name: 'Meteor',
    description: 'Call down a devastating meteor from the sky',
    manaCost: 50,
    cooldown: 25,
    damage: 120,
    requiredLevel: 10,
  },
];

// Rogue Abilities
const rogueAbilities: Ability[] = [
  {
    id: 'backstab',
    name: 'Backstab',
    description: 'Strike from the shadows with increased crit chance',
    manaCost: 15,
    cooldown: 5,
    damage: 35,
    requiredLevel: 1,
  },
  {
    id: 'poison-blade',
    name: 'Poison Blade',
    description: 'Apply poison that deals damage over time',
    manaCost: 20,
    cooldown: 10,
    damage: 20,
    effect: 'dot',
    effectValue: 5,
    requiredLevel: 3,
  },
  {
    id: 'smoke-bomb',
    name: 'Smoke Bomb',
    description: 'Evade the next attack and boost speed',
    manaCost: 25,
    cooldown: 12,
    damage: 0,
    effect: 'buff',
    effectValue: 30,
    requiredLevel: 6,
  },
  {
    id: 'assassinate',
    name: 'Assassinate',
    description: 'Execute a devastating attack. Higher damage at low enemy HP',
    manaCost: 40,
    cooldown: 18,
    damage: 80,
    requiredLevel: 9,
  },
];

// Ranger Abilities
const rangerAbilities: Ability[] = [
  {
    id: 'precise-shot',
    name: 'Precise Shot',
    description: 'A carefully aimed arrow with bonus accuracy',
    manaCost: 12,
    cooldown: 4,
    damage: 30,
    requiredLevel: 1,
  },
  {
    id: 'multi-shot',
    name: 'Multi-Shot',
    description: 'Fire three arrows in rapid succession',
    manaCost: 25,
    cooldown: 8,
    damage: 50,
    requiredLevel: 3,
  },
  {
    id: 'nature-bond',
    name: "Nature's Bond",
    description: 'Heal wounds using the power of nature',
    manaCost: 30,
    cooldown: 15,
    damage: 0,
    effect: 'heal',
    effectValue: 50,
    requiredLevel: 5,
  },
  {
    id: 'rain-of-arrows',
    name: 'Rain of Arrows',
    description: 'Unleash a devastating barrage from above',
    manaCost: 45,
    cooldown: 20,
    damage: 90,
    requiredLevel: 8,
  },
];

export const CHARACTERS: Record<string, CharacterData> = {
  knight: {
    id: 'knight',
    name: 'Sir Aldric',
    title: 'The Ironclad',
    description: 'A stalwart defender with high health and defense. Excels at sustained combat.',
    backstory: 'Once a royal guard of the fallen kingdom of Valdoria, Sir Aldric now wanders the land seeking to restore honor to his name.',
    baseStats: {
      hp: 150,
      mp: 80,
      attack: 25,
      defense: 30,
      speed: 15,
      critChance: 10,
      critDamage: 150,
    },
    abilities: knightAbilities,
    color: '#c45c3a',
    unlocked: true,
  },
  mage: {
    id: 'mage',
    name: 'Elara',
    title: 'The Spellweaver',
    description: 'A powerful spellcaster with devastating magical attacks. High damage but fragile.',
    backstory: 'Elara discovered her affinity for magic through an ancient tome that responded to the rhythm of her typing.',
    baseStats: {
      hp: 80,
      mp: 150,
      attack: 40,
      defense: 10,
      speed: 20,
      critChance: 15,
      critDamage: 180,
    },
    abilities: mageAbilities,
    color: '#7c4dff',
    unlocked: false,
    unlockRequirement: 'Reach Level 5',
  },
  rogue: {
    id: 'rogue',
    name: 'Shadow',
    title: 'The Whisperblade',
    description: 'A swift assassin with high crit chance. Speed and precision are key.',
    backstory: 'Known only as Shadow, this mysterious figure types with such speed that enemies fall before they can react.',
    baseStats: {
      hp: 90,
      mp: 100,
      attack: 35,
      defense: 15,
      speed: 35,
      critChance: 25,
      critDamage: 200,
    },
    abilities: rogueAbilities,
    color: '#26a69a',
    unlocked: false,
    unlockRequirement: 'Defeat 50 enemies',
  },
  ranger: {
    id: 'ranger',
    name: 'Lyra',
    title: 'The Windstrider',
    description: 'A balanced fighter with healing abilities. Great for learning the game.',
    backstory: 'Lyra grew up in the Whispering Woods, learning to type as fast as the wind itself.',
    baseStats: {
      hp: 110,
      mp: 110,
      attack: 30,
      defense: 20,
      speed: 25,
      critChance: 18,
      critDamage: 160,
    },
    abilities: rangerAbilities,
    color: '#66bb6a',
    unlocked: false,
    unlockRequirement: 'Complete Verdant Vale',
  },
};

export const getCharacter = (id: string): CharacterData | undefined => {
  return CHARACTERS[id];
};
