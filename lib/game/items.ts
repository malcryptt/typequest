// Items and Equipment Data

import type { Item } from './types';

export const ITEMS: Record<string, Item> = {
  // Starter Items
  'wooden-sword': {
    id: 'wooden-sword',
    name: 'Wooden Sword',
    description: 'A simple training sword. Better than nothing.',
    type: 'weapon',
    rarity: 'common',
    stats: { attack: 5 },
    value: 10,
    icon: 'sword',
  },
  'cloth-armor': {
    id: 'cloth-armor',
    name: 'Cloth Armor',
    description: 'Basic protection made of sturdy cloth.',
    type: 'armor',
    rarity: 'common',
    stats: { defense: 3, maxHealth: 10 },
    value: 15,
    icon: 'shirt',
  },

  // Verdant Vale Items
  'treant-bark-shield': {
    id: 'treant-bark-shield',
    name: 'Treant Bark Shield',
    description: 'A shield grown from the living bark of the Treant Guardian.',
    type: 'armor',
    rarity: 'rare',
    stats: { defense: 15, maxHealth: 30 },
    value: 150,
    icon: 'shield',
  },
  'forest-dagger': {
    id: 'forest-dagger',
    name: 'Forest Dagger',
    description: 'A swift blade forged from elvish steel.',
    type: 'weapon',
    rarity: 'uncommon',
    stats: { attack: 12, critChance: 5, speed: 3 },
    value: 80,
    icon: 'sword',
  },
  'sprite-ring': {
    id: 'sprite-ring',
    name: 'Sprite Ring',
    description: 'A ring imbued with forest magic.',
    type: 'accessory',
    rarity: 'uncommon',
    stats: { maxMana: 20, speed: 2 },
    value: 60,
    icon: 'gem',
  },

  // Misty Marshes Items
  'hydra-scale-mail': {
    id: 'hydra-scale-mail',
    name: 'Hydra Scale Mail',
    description: 'Armor crafted from the impenetrable scales of a hydra.',
    type: 'armor',
    rarity: 'epic',
    stats: { defense: 25, maxHealth: 50, attack: 5 },
    value: 400,
    icon: 'shield',
  },
  'witch-staff': {
    id: 'witch-staff',
    name: "Marsh Witch's Staff",
    description: 'A gnarled staff crackling with dark energy.',
    type: 'weapon',
    rarity: 'rare',
    stats: { attack: 20, maxMana: 30, critDamage: 20 },
    value: 200,
    icon: 'wand',
  },
  'venom-fang': {
    id: 'venom-fang',
    name: 'Venom Fang Pendant',
    description: 'A pendant that grants resistance to poison.',
    type: 'accessory',
    rarity: 'uncommon',
    stats: { defense: 5, maxHealth: 20 },
    value: 100,
    icon: 'gem',
  },

  // Frostpeak Items
  'wyrm-fang-blade': {
    id: 'wyrm-fang-blade',
    name: 'Wyrm Fang Blade',
    description: 'A legendary sword forged from a Frost Wyrm fang.',
    type: 'weapon',
    rarity: 'legendary',
    stats: { attack: 40, critChance: 10, critDamage: 30, speed: 5 },
    value: 800,
    icon: 'sword',
  },
  'yeti-pelt': {
    id: 'yeti-pelt',
    name: 'Yeti Pelt Cloak',
    description: 'A warm cloak that provides excellent protection.',
    type: 'armor',
    rarity: 'rare',
    stats: { defense: 20, maxHealth: 40 },
    value: 300,
    icon: 'shirt',
  },
  'frost-crystal': {
    id: 'frost-crystal',
    name: 'Frost Crystal',
    description: 'A crystallized essence of pure cold.',
    type: 'accessory',
    rarity: 'rare',
    stats: { maxMana: 40, critChance: 5 },
    value: 250,
    icon: 'gem',
  },

  // Shadow Citadel Items
  'lich-crown': {
    id: 'lich-crown',
    name: "Lich King's Crown",
    description: 'The crown of the fallen Lich King, radiating dark power.',
    type: 'accessory',
    rarity: 'legendary',
    stats: { attack: 20, maxMana: 60, critDamage: 40 },
    value: 1200,
    icon: 'crown',
  },
  'phantom-blade': {
    id: 'phantom-blade',
    name: 'Phantom Blade',
    description: 'A spectral weapon that phases through armor.',
    type: 'weapon',
    rarity: 'epic',
    stats: { attack: 35, critChance: 15 },
    value: 600,
    icon: 'sword',
  },
  'bone-armor': {
    id: 'bone-armor',
    name: 'Bone Plate Armor',
    description: 'Armor assembled from the bones of fallen warriors.',
    type: 'armor',
    rarity: 'epic',
    stats: { defense: 30, maxHealth: 60, attack: 10 },
    value: 550,
    icon: 'shield',
  },

  // Dragon's Peak Items
  'dragonheart-amulet': {
    id: 'dragonheart-amulet',
    name: 'Dragonheart Amulet',
    description: 'Contains the still-beating heart of a dragon. Grants immense power.',
    type: 'accessory',
    rarity: 'legendary',
    stats: { maxHealth: 100, attack: 25, defense: 15, critDamage: 50 },
    value: 2000,
    icon: 'gem',
  },
  'flame-tongue-sword': {
    id: 'flame-tongue-sword',
    name: 'Flame Tongue',
    description: 'A sword wreathed in eternal dragon fire.',
    type: 'weapon',
    rarity: 'legendary',
    stats: { attack: 55, critChance: 20, critDamage: 50 },
    value: 2500,
    icon: 'sword',
  },
  'dragon-scale-armor': {
    id: 'dragon-scale-armor',
    name: 'Dragon Scale Armor',
    description: 'The ultimate armor, forged from ancient dragon scales.',
    type: 'armor',
    rarity: 'legendary',
    stats: { defense: 45, maxHealth: 80, attack: 15 },
    value: 2200,
    icon: 'shield',
  },

  // Consumables
  'health-potion': {
    id: 'health-potion',
    name: 'Health Potion',
    description: 'Restores 50 health points.',
    type: 'consumable',
    rarity: 'common',
    effect: 'heal:50',
    value: 25,
    icon: 'potion',
  },
  'mana-potion': {
    id: 'mana-potion',
    name: 'Mana Potion',
    description: 'Restores 40 mana points.',
    type: 'consumable',
    rarity: 'common',
    effect: 'mana:40',
    value: 30,
    icon: 'potion',
  },
  'elixir': {
    id: 'elixir',
    name: 'Elixir of Power',
    description: 'Temporarily increases attack by 20%.',
    type: 'consumable',
    rarity: 'uncommon',
    effect: 'buff:attack:20',
    value: 75,
    icon: 'potion',
  },
  'greater-health-potion': {
    id: 'greater-health-potion',
    name: 'Greater Health Potion',
    description: 'Restores 150 health points.',
    type: 'consumable',
    rarity: 'rare',
    effect: 'heal:150',
    value: 100,
    icon: 'potion',
  },
};

// Shop inventory by region
export const SHOP_INVENTORY: Record<string, string[]> = {
  'verdant-vale': ['health-potion', 'mana-potion', 'wooden-sword', 'cloth-armor', 'forest-dagger', 'sprite-ring'],
  'misty-marshes': ['health-potion', 'mana-potion', 'elixir', 'witch-staff', 'venom-fang'],
  'frostpeak': ['health-potion', 'greater-health-potion', 'mana-potion', 'elixir', 'yeti-pelt', 'frost-crystal'],
  'shadow-citadel': ['greater-health-potion', 'mana-potion', 'elixir', 'phantom-blade', 'bone-armor'],
  'dragons-peak': ['greater-health-potion', 'mana-potion', 'elixir', 'dragon-scale-armor'],
};

export const getItem = (id: string): Item | undefined => {
  return ITEMS[id];
};

export const getShopItems = (regionId: string): Item[] => {
  const itemIds = SHOP_INVENTORY[regionId] || SHOP_INVENTORY['verdant-vale'];
  return itemIds.map(id => ITEMS[id]).filter(Boolean);
};

export const getRarityColor = (rarity: Item['rarity']): string => {
  switch (rarity) {
    case 'common': return '#9e9e9e';
    case 'uncommon': return '#4caf50';
    case 'rare': return '#2196f3';
    case 'epic': return '#9c27b0';
    case 'legendary': return '#ff9800';
    default: return '#9e9e9e';
  }
};
