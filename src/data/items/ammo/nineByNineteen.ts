import type { AmmoItem } from "./types";

export const nineByNineteenAmmo: AmmoItem[] = [
  {
    id: "ammo_9x19_fmj",
    name: "9x19 FMJ",
    category: "ammo",
    rarity: "common",
    value: 2,
    ammoType: "9x19",
    damage: 20,
    armorDamage: 10,
    accuracyModifier: 2,
  },
  {
    id: "ammo_9x19_ap",
    name: "9x19 AP",
    category: "ammo",
    rarity: "uncommon",
    value: 5,
    ammoType: "9x19",
    damage: 16,
    armorDamage: 20,
    accuracyModifier: -1,
  },
  {
    id: "ammo_9x19_hp",
    name: "9x19 HP",
    category: "ammo",
    rarity: "common",
    value: 3,
    ammoType: "9x19",
    damage: 30,
    armorDamage: 4,
    accuracyModifier: 3,
  },
];
