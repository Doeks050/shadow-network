import type { AmmoItem } from "./ammo/types";
import type { WeaponItem } from "./weapons/types";

export type ItemCategory =
  | "weapon"
  | "ammo"
  | "armor"
  | "helmet"
  | "rig"
  | "backpack"
  | "medical"
  | "attachment"
  | "valuable"
  | "key_item"
  | "loot";

export type ItemRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export type AmmoType =
  | "9x19"
  | "45acp"
  | "556x45"
  | "762x39"
  | "762x51"
  | "9x39"
  | "50bmg";

export type AttachmentSlot =
  | "optic"
  | "muzzle"
  | "underbarrel"
  | "magazine"
  | "stock";

export type BaseItem = {
  id: string;
  name: string;
  category: ItemCategory;
  rarity: ItemRarity;
  value: number;
};

export type ArmorItem = BaseItem & {
  category: "armor";
  protection: number;
  durability: number;
  weight: number;
};

export type HelmetItem = BaseItem & {
  category: "helmet";
  protection: number;
  durability: number;
  weight: number;
};

export type RigItem = BaseItem & {
  category: "rig";
  slots: number;
  weight: number;
};

export type BackpackItem = BaseItem & {
  category: "backpack";
  slots: number;
  carryWeightBonus: number;
  weight: number;
};

export type MedicalItem = BaseItem & {
  category: "medical";
  healingPower: number;
};

export type AttachmentItem = BaseItem & {
  category: "attachment";
  slot: AttachmentSlot;
  accuracyModifier: number;
  ammoCapacityModifier?: number;
};

export type ValuableItem = BaseItem & {
  category: "valuable";
};

export type KeyItem = BaseItem & {
  category: "key_item";
};

export type LootItem = BaseItem & {
  category: "loot";
};

export type GameItem =
  | WeaponItem
  | AmmoItem
  | ArmorItem
  | HelmetItem
  | RigItem
  | BackpackItem
  | MedicalItem
  | AttachmentItem
  | ValuableItem
  | KeyItem
  | LootItem;
