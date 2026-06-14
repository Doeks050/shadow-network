export type CarryContainer = "pockets" | "rig" | "armor" | "backpack";

export type CarriedItemStack = {
  itemId: string;
  quantity: number;
  container: CarryContainer;
};

export type PlayerLoadout = {
  primaryWeaponId: string;
  sidearmId: string;
  armorId: string;
  helmetId: string;
  rigId: string;
  backpackId: string;
  carriedItems: CarriedItemStack[];
};

export const loadout: PlayerLoadout = {
  primaryWeaponId: "m4a1",
  sidearmId: "glock_17",
  armorId: "soft_armor_vest",
  helmetId: "basic_helmet",
  rigId: "scout_rig",
  backpackId: "small_backpack",
  carriedItems: [],
};
