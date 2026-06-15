import type { ArmorItem } from "./types";

export const armor: ArmorItem[] = [
  {
    id: "soft_armor_vest",
    name: "Soft Armor Vest",
    category: "armor",
    rarity: "common",
    value: 450,
    protection: 15,
    durability: 100,
    weight: 3,
  },
  {
    id: "padded_security_vest",
    name: "Padded Security Vest",
    category: "armor",
    rarity: "common",
    value: 650,
    protection: 20,
    durability: 110,
    weight: 4,
  },
  {
    id: "plate_carrier",
    name: "Plate Carrier",
    category: "armor",
    rarity: "uncommon",
    value: 1100,
    protection: 35,
    durability: 130,
    weight: 6,
  },
  {
    id: "reinforced_carrier",
    name: "Reinforced Carrier",
    category: "armor",
    rarity: "rare",
    value: 1800,
    protection: 50,
    durability: 160,
    weight: 8,
  },
];
