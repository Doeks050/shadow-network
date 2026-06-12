import type { AmmoItem } from "./types";

export const sevenSixTwoAmmo: AmmoItem[] = [
  {
    id: "ammo_762x39_fmj",
    name: "7.62x39 FMJ",
    category: "ammo",
    rarity: "common",
    value: 7,
    ammoType: "762x39",
    damage: 38,
    armorDamage: 25,
    accuracyModifier: -1,
  },
  {
    id: "ammo_762x39_ap",
    name: "7.62x39 AP",
    category: "ammo",
    rarity: "uncommon",
    value: 15,
    ammoType: "762x39",
    damage: 30,
    armorDamage: 40,
    accuracyModifier: -3,
  },
  {
    id: "ammo_762x39_hp",
    name: "7.62x39 HP",
    category: "ammo",
    rarity: "common",
    value: 9,
    ammoType: "762x39",
    damage: 55,
    armorDamage: 10,
    accuracyModifier: -2,
  },
];
