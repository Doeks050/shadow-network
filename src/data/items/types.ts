import type { AmmoItem } from "./ammo/types";
import type { WeaponItem } from "./weapons/types";

export type ItemCategory =
  | "weapon"
  | "ammo"
  | "magazine"
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
  | "22lr"
  | "380acp"
  | "9x18"
  | "9x19"
  | "357magnum"
  | "40sw"
  | "45acp"
  | "50ae"
  | "46x30"
  | "57x28"
  | "545x39"
  | "556x45"
  | "68spc"
  | "300blackout"
  | "762x39"
  | "762x51"
  | "308"
  | "762x54r"
  | "30-06"
  | "9x39"
  | "127x55"
  | "65creedmoor"
  | "300winmag"
  | "338lapua"
  | "408cheytac"
  | "50bmg"
  | "12gauge"
  | "20gauge"
  | "10gauge"
  | "410bore"
  | "44magnum";

export type AttachmentSlot =
  | "optic"
  | "muzzle"
  | "barrel"
  | "underbarrel"
  | "tactical"
  | "magazine"
  | "stock";

export type BaseItem = {
  id: string;
  name: string;
  category: ItemCategory;
  rarity: ItemRarity;
  value: number;
};

export type MagazineItem = BaseItem & {
  category: "magazine";
  attachmentSlot: "magazine";
  magazineFamily: string;
  ammoType: AmmoType;
  capacity: number;
  slotCost: number;
  weight: number;
  damageOutputModifier: number;
  handlingModifier: number;
  recoilControlModifier: number;
  reloadSpeedModifier: number;
  reliabilityModifier: number;
};

export type ArmorItem = BaseItem & {
  category: "armor";
  protection: number;
  durability: number;
  weight: number;
  slots?: number;
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
  slotCost?: number;
};

export type AttachmentItem = BaseItem & {
  category: "attachment";
  slot: AttachmentSlot;
  attachmentFamily: string;
  compatibleWeaponFamilies?: string[];
  accuracyModifier?: number;
  handlingModifier?: number;
  recoilControlModifier?: number;
  reloadSpeedModifier?: number;
  fireRateModifier?: number;
  reliabilityModifier?: number;
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
  | MagazineItem
  | ArmorItem
  | HelmetItem
  | RigItem
  | BackpackItem
  | MedicalItem
  | AttachmentItem
  | ValuableItem
  | KeyItem
  | LootItem;
