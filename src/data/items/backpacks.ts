import type { BackpackItem } from "./types";

export const backpacks: BackpackItem[] = [
  {
    id: "small_backpack",
    name: "Small Backpack",
    category: "backpack",
    rarity: "common",
    value: 150,
    slots: 8,
    carryWeightBonus: 8,
    weight: 1,
  },
  {
    id: "field_backpack",
    name: "Field Backpack",
    category: "backpack",
    rarity: "common",
    value: 360,
    slots: 12,
    carryWeightBonus: 12,
    weight: 2,
  },
  {
    id: "hiking_pack",
    name: "Hiking Pack",
    category: "backpack",
    rarity: "uncommon",
    value: 680,
    slots: 16,
    carryWeightBonus: 16,
    weight: 3,
  },
  {
    id: "large_rucksack",
    name: "Large Rucksack",
    category: "backpack",
    rarity: "rare",
    value: 1200,
    slots: 24,
    carryWeightBonus: 24,
    weight: 5,
  },
];
