import type { AmmoItem } from "./types";

export const fiveFiveSixAmmo: AmmoItem[] = [
  {
    id: "ammo_556_fmj",
    name: "5.56x45 FMJ",
    category: "ammo",
    rarity: "common",
    value: 5,
    ammoType: "556x45",
    damage: 30,
    armorDamage: 20,
    accuracyModifier: 1,
  },
  {
    id: "ammo_556_ap",
    name: "5.56x45 AP",
    category: "ammo",
    rarity: "uncommon",
    value: 12,
    ammoType: "556x45",
    damage: 24,
    armorDamage: 40,
    accuracyModifier: -2,
  },
  {
    id: "ammo_556_hp",
    name: "5.56x45 HP",
    category: "ammo",
    rarity: "common",
    value: 7,
    ammoType: "556x45",
    damage: 45,
    armorDamage: 8,
    accuracyModifier: 2,
  },
];
