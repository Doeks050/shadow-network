import type { WeaponItem } from "./types";

export const assaultRifles: WeaponItem[] = [
  {
    id: "m4a1",
    name: "M4A1",
    category: "weapon",
    rarity: "rare",
    value: 2500,
    weaponType: "assault_rifle",
    ammoType: "556x45",
    accuracy: 75,
    range: "medium",
    reliability: 85,
  },
  {
    id: "akm",
    name: "AKM",
    category: "weapon",
    rarity: "uncommon",
    value: 1900,
    weaponType: "assault_rifle",
    ammoType: "762x39",
    accuracy: 67,
    range: "medium",
    reliability: 90,
  },
];
