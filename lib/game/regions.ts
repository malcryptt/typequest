// Region and Level Data

import type { Region, Level, DialogueNode } from './types';
import {
  VERDANT_VALE_ENEMIES,
  MISTY_MARSHES_ENEMIES,
  FROSTPEAK_ENEMIES,
  SHADOW_CITADEL_ENEMIES,
  DRAGONS_PEAK_ENEMIES,
} from './enemies';

// Dialogue for Verdant Vale
const verdantValeIntro: DialogueNode[] = [
  {
    id: 'vv-1',
    speaker: 'Old Hermit',
    text: 'Ah, a traveler! These woods have grown dangerous since the darkness spread from the north.',
    next: 'vv-2',
  },
  {
    id: 'vv-2',
    speaker: 'Old Hermit',
    text: 'The creatures here respond to the rhythm of words. Type quickly and accurately to defeat them!',
    next: 'vv-3',
  },
  {
    id: 'vv-3',
    speaker: 'Old Hermit',
    text: 'Will you help cleanse these woods of the corruption?',
    choices: [
      { text: 'I will help restore peace to these lands.', nextId: 'vv-accept' },
      { text: 'What rewards await me?', nextId: 'vv-rewards' },
    ],
  },
  {
    id: 'vv-accept',
    speaker: 'Old Hermit',
    text: 'Brave soul! Start with the Forest Sprites - they are weakened by fast typing. May your fingers be swift!',
  },
  {
    id: 'vv-rewards',
    speaker: 'Old Hermit',
    text: 'Gold, experience, and rare equipment await those who triumph. The Treant Guardian guards a legendary shield.',
    next: 'vv-accept',
  },
];

// Create levels for each region
const createVerdantValeLevels = (): Level[] => [
  {
    id: 'vv-level-1',
    name: 'Forest Edge',
    description: 'The outskirts of Verdant Vale, home to mischievous sprites.',
    enemies: [VERDANT_VALE_ENEMIES[0], VERDANT_VALE_ENEMIES[0], VERDANT_VALE_ENEMIES[2]],
    rewards: { gold: 30, experience: 50 },
    completed: false,
    stars: 0,
    dialogue: verdantValeIntro,
  },
  {
    id: 'vv-level-2',
    name: 'Boar Den',
    description: 'Wild boars have made this area their territory.',
    enemies: [VERDANT_VALE_ENEMIES[1], VERDANT_VALE_ENEMIES[1], VERDANT_VALE_ENEMIES[0]],
    rewards: { gold: 40, experience: 60 },
    completed: false,
    stars: 0,
  },
  {
    id: 'vv-level-3',
    name: 'Goblin Camp',
    description: 'A small goblin scouting party has set up camp here.',
    enemies: [VERDANT_VALE_ENEMIES[2], VERDANT_VALE_ENEMIES[2], VERDANT_VALE_ENEMIES[2], VERDANT_VALE_ENEMIES[1]],
    rewards: { gold: 50, experience: 75 },
    completed: false,
    stars: 0,
  },
  {
    id: 'vv-level-4',
    name: 'Deep Woods',
    description: 'The heart of the forest, where danger lurks.',
    enemies: [VERDANT_VALE_ENEMIES[0], VERDANT_VALE_ENEMIES[1], VERDANT_VALE_ENEMIES[2], VERDANT_VALE_ENEMIES[2]],
    rewards: { gold: 60, experience: 90 },
    completed: false,
    stars: 0,
  },
  {
    id: 'vv-boss',
    name: 'Grove of Ancients',
    description: 'The corrupted Treant Guardian awaits.',
    enemies: [VERDANT_VALE_ENEMIES[2], VERDANT_VALE_ENEMIES[1]],
    boss: VERDANT_VALE_ENEMIES[3],
    rewards: { gold: 150, experience: 200, items: ['treant-bark-shield'] },
    completed: false,
    stars: 0,
  },
];

const createMistyMarshesLevels = (): Level[] => [
  {
    id: 'mm-level-1',
    name: 'Marsh Entrance',
    description: 'The fog rolls in as you enter the marshlands.',
    enemies: [MISTY_MARSHES_ENEMIES[0], MISTY_MARSHES_ENEMIES[1], MISTY_MARSHES_ENEMIES[0]],
    rewards: { gold: 60, experience: 90 },
    completed: false,
    stars: 0,
  },
  {
    id: 'mm-level-2',
    name: 'Toxic Pools',
    description: 'Venomous creatures thrive in these poisonous waters.',
    enemies: [MISTY_MARSHES_ENEMIES[1], MISTY_MARSHES_ENEMIES[1], MISTY_MARSHES_ENEMIES[0], MISTY_MARSHES_ENEMIES[1]],
    rewards: { gold: 75, experience: 110 },
    completed: false,
    stars: 0,
  },
  {
    id: 'mm-level-3',
    name: "Witch's Hollow",
    description: 'Dark magic permeates this cursed grove.',
    enemies: [MISTY_MARSHES_ENEMIES[2], MISTY_MARSHES_ENEMIES[2], MISTY_MARSHES_ENEMIES[0]],
    rewards: { gold: 90, experience: 130 },
    completed: false,
    stars: 0,
  },
  {
    id: 'mm-level-4',
    name: 'Sunken Ruins',
    description: 'Ancient structures rise from the murky depths.',
    enemies: [MISTY_MARSHES_ENEMIES[0], MISTY_MARSHES_ENEMIES[1], MISTY_MARSHES_ENEMIES[2], MISTY_MARSHES_ENEMIES[2]],
    rewards: { gold: 100, experience: 150 },
    completed: false,
    stars: 0,
  },
  {
    id: 'mm-boss',
    name: 'Hydra Lair',
    description: 'Face the multi-headed terror of the marshes.',
    enemies: [MISTY_MARSHES_ENEMIES[2], MISTY_MARSHES_ENEMIES[0]],
    boss: MISTY_MARSHES_ENEMIES[3],
    rewards: { gold: 300, experience: 400, items: ['hydra-scale-mail'] },
    completed: false,
    stars: 0,
  },
];

const createFrostpeakLevels = (): Level[] => [
  {
    id: 'fp-level-1',
    name: 'Mountain Pass',
    description: 'The freezing winds cut through to the bone.',
    enemies: [FROSTPEAK_ENEMIES[0], FROSTPEAK_ENEMIES[0], FROSTPEAK_ENEMIES[0]],
    rewards: { gold: 100, experience: 150 },
    completed: false,
    stars: 0,
  },
  {
    id: 'fp-level-2',
    name: 'Ice Caverns',
    description: 'Elemental beings guard these frozen halls.',
    enemies: [FROSTPEAK_ENEMIES[1], FROSTPEAK_ENEMIES[0], FROSTPEAK_ENEMIES[1]],
    rewards: { gold: 120, experience: 180 },
    completed: false,
    stars: 0,
  },
  {
    id: 'fp-level-3',
    name: 'Yeti Territory',
    description: 'The great beasts of the mountain roam here.',
    enemies: [FROSTPEAK_ENEMIES[2], FROSTPEAK_ENEMIES[2], FROSTPEAK_ENEMIES[0]],
    rewards: { gold: 140, experience: 210 },
    completed: false,
    stars: 0,
  },
  {
    id: 'fp-level-4',
    name: 'Frozen Summit',
    description: 'The peak of Frostpeak, where only the brave venture.',
    enemies: [FROSTPEAK_ENEMIES[1], FROSTPEAK_ENEMIES[2], FROSTPEAK_ENEMIES[1], FROSTPEAK_ENEMIES[2]],
    rewards: { gold: 160, experience: 240 },
    completed: false,
    stars: 0,
  },
  {
    id: 'fp-boss',
    name: "Wyrm's Nest",
    description: 'The ancient Frost Wyrm awakens from its slumber.',
    enemies: [FROSTPEAK_ENEMIES[2], FROSTPEAK_ENEMIES[1]],
    boss: FROSTPEAK_ENEMIES[3],
    rewards: { gold: 500, experience: 650, items: ['wyrm-fang-blade'] },
    completed: false,
    stars: 0,
  },
];

const createShadowCitadelLevels = (): Level[] => [
  {
    id: 'sc-level-1',
    name: 'Citadel Gates',
    description: 'The undead guard the entrance to this dark fortress.',
    enemies: [SHADOW_CITADEL_ENEMIES[0], SHADOW_CITADEL_ENEMIES[0], SHADOW_CITADEL_ENEMIES[0]],
    rewards: { gold: 150, experience: 225 },
    completed: false,
    stars: 0,
  },
  {
    id: 'sc-level-2',
    name: 'Cult Chambers',
    description: 'Dark rituals echo through these twisted halls.',
    enemies: [SHADOW_CITADEL_ENEMIES[1], SHADOW_CITADEL_ENEMIES[1], SHADOW_CITADEL_ENEMIES[0]],
    rewards: { gold: 180, experience: 270 },
    completed: false,
    stars: 0,
  },
  {
    id: 'sc-level-3',
    name: 'Hall of Phantoms',
    description: 'Spectral knights patrol these cursed corridors.',
    enemies: [SHADOW_CITADEL_ENEMIES[2], SHADOW_CITADEL_ENEMIES[0], SHADOW_CITADEL_ENEMIES[2]],
    rewards: { gold: 200, experience: 300 },
    completed: false,
    stars: 0,
  },
  {
    id: 'sc-level-4',
    name: 'Inner Sanctum',
    description: 'The final approach to the throne of darkness.',
    enemies: [SHADOW_CITADEL_ENEMIES[1], SHADOW_CITADEL_ENEMIES[2], SHADOW_CITADEL_ENEMIES[2], SHADOW_CITADEL_ENEMIES[0]],
    rewards: { gold: 220, experience: 330 },
    completed: false,
    stars: 0,
  },
  {
    id: 'sc-boss',
    name: 'Throne of Shadows',
    description: 'The Lich King awaits on his throne of bones.',
    enemies: [SHADOW_CITADEL_ENEMIES[2], SHADOW_CITADEL_ENEMIES[1]],
    boss: SHADOW_CITADEL_ENEMIES[3],
    rewards: { gold: 700, experience: 900, items: ['lich-crown'] },
    completed: false,
    stars: 0,
  },
];

const createDragonsPeakLevels = (): Level[] => [
  {
    id: 'dp-level-1',
    name: 'Volcanic Slopes',
    description: 'Molten rock flows down from the peak above.',
    enemies: [DRAGONS_PEAK_ENEMIES[0], DRAGONS_PEAK_ENEMIES[0], DRAGONS_PEAK_ENEMIES[1]],
    rewards: { gold: 250, experience: 350 },
    completed: false,
    stars: 0,
  },
  {
    id: 'dp-level-2',
    name: 'Drake Nesting Grounds',
    description: 'Young dragons hunt in these fiery wastes.',
    enemies: [DRAGONS_PEAK_ENEMIES[1], DRAGONS_PEAK_ENEMIES[1], DRAGONS_PEAK_ENEMIES[0]],
    rewards: { gold: 300, experience: 420 },
    completed: false,
    stars: 0,
  },
  {
    id: 'dp-level-3',
    name: 'Infernal Pit',
    description: 'Demons have made this hellscape their domain.',
    enemies: [DRAGONS_PEAK_ENEMIES[2], DRAGONS_PEAK_ENEMIES[2], DRAGONS_PEAK_ENEMIES[1]],
    rewards: { gold: 350, experience: 500 },
    completed: false,
    stars: 0,
  },
  {
    id: 'dp-level-4',
    name: 'Path to the Summit',
    description: 'Only the worthy may challenge the Ancient One.',
    enemies: [DRAGONS_PEAK_ENEMIES[0], DRAGONS_PEAK_ENEMIES[1], DRAGONS_PEAK_ENEMIES[2], DRAGONS_PEAK_ENEMIES[2]],
    rewards: { gold: 400, experience: 580 },
    completed: false,
    stars: 0,
  },
  {
    id: 'dp-boss',
    name: "Dragon's Throne",
    description: 'Face Ignaroth, the World Ender.',
    enemies: [DRAGONS_PEAK_ENEMIES[2], DRAGONS_PEAK_ENEMIES[1]],
    boss: DRAGONS_PEAK_ENEMIES[3],
    rewards: { gold: 1500, experience: 2000, items: ['dragonheart-amulet', 'flame-tongue-sword'] },
    completed: false,
    stars: 0,
  },
];

export const REGIONS: Region[] = [
  {
    id: 'verdant-vale',
    name: 'Verdant Vale',
    description: 'A once-peaceful forest now corrupted by dark magic. Perfect for beginning your journey.',
    requiredLevel: 1,
    levels: createVerdantValeLevels(),
    unlocked: true,
    completed: false,
    environment: 'forest',
    color: '#4caf50',
  },
  {
    id: 'misty-marshes',
    name: 'Misty Marshes',
    description: 'Treacherous swamplands filled with poisonous creatures and dark witchcraft.',
    requiredLevel: 5,
    levels: createMistyMarshesLevels(),
    unlocked: false,
    completed: false,
    environment: 'swamp',
    color: '#607d8b',
  },
  {
    id: 'frostpeak',
    name: 'Frostpeak Mountains',
    description: 'The frozen peaks where elemental beings and ancient wyrms dwell.',
    requiredLevel: 10,
    levels: createFrostpeakLevels(),
    unlocked: false,
    completed: false,
    environment: 'mountains',
    color: '#2196f3',
  },
  {
    id: 'shadow-citadel',
    name: 'Shadow Citadel',
    description: 'The dark fortress of the Lich King, filled with undead horrors.',
    requiredLevel: 15,
    levels: createShadowCitadelLevels(),
    unlocked: false,
    completed: false,
    environment: 'castle',
    color: '#673ab7',
  },
  {
    id: 'dragons-peak',
    name: "Dragon's Peak",
    description: 'The volcanic lair of Ignaroth, the World Ender. Only legends survive here.',
    requiredLevel: 20,
    levels: createDragonsPeakLevels(),
    unlocked: false,
    completed: false,
    environment: 'volcano',
    color: '#f44336',
  },
];

export const getRegion = (id: string): Region | undefined => {
  return REGIONS.find(r => r.id === id);
};

export const getLevel = (regionId: string, levelId: string): Level | undefined => {
  const region = getRegion(regionId);
  return region?.levels.find(l => l.id === levelId);
};
