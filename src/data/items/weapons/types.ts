import type { AmmoType, BaseItem } from "../types";

export type WeaponType =
  | "pistol"
  | "smg"
  | "assault_rifle"
  | "battle_rifle"
  | "marksman_rifle"
  | "sniper_rifle";

export type WeaponItem = BaseItem & {
  category: "weapon";
  weaponType: WeaponType;
  ammoType: AmmoType;
  accuracy: number;
  range: "short" | "medium" | "long";
  reliability: number;
};
