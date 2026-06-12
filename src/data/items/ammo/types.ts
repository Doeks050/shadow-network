import type { AmmoType, BaseItem } from "../types";

export type AmmoItem = BaseItem & {
  category: "ammo";
  ammoType: AmmoType;
  damage: number;
  armorDamage: number;
  accuracyModifier: number;
};
