import type { AttachmentSlot } from "@/data/items";

export type CarryContainer = "pockets" | "chest";

export type WeaponAttachmentSlots = {
  opticId: string;
  barrelId: string;
  muzzleId: string;
  underbarrelId: string;
  tacticalId: string;
  stockId: string;
};

export type WeaponAttachmentSlotId = keyof WeaponAttachmentSlots;

export type CarriedItemStack = {
  itemId: string;
  quantity: number;
  container: CarryContainer;
};

export type CarriedMagazine = {
  instanceId: string;
  magazineItemId: string;
  loadedAmmoId: string;
  loadedRounds: number;
  container: CarryContainer;
};

export type PlayerLoadout = {
  primaryWeaponId: string;
  primaryMagazineInstanceId: string;
  primaryAttachments: WeaponAttachmentSlots;

  secondaryWeaponId: string;
  secondaryMagazineInstanceId: string;
  secondaryAttachments: WeaponAttachmentSlots;

  headgearId: string;
  armorId: string;
  rigId: string;
  carriedItems: CarriedItemStack[];
  carriedMagazines: CarriedMagazine[];
};

export const emptyWeaponAttachments: WeaponAttachmentSlots = {
  opticId: "",
  barrelId: "",
  muzzleId: "",
  underbarrelId: "",
  tacticalId: "",
  stockId: "",
};

export const attachmentSlotIdToAttachmentSlot: Record<
  WeaponAttachmentSlotId,
  AttachmentSlot
> = {
  opticId: "optic",
  barrelId: "barrel",
  muzzleId: "muzzle",
  underbarrelId: "underbarrel",
  tacticalId: "tactical",
  stockId: "stock",
};

export const loadout: PlayerLoadout = {
  primaryWeaponId: "m4a1",
  primaryMagazineInstanceId: "",
  primaryAttachments: emptyWeaponAttachments,

  secondaryWeaponId: "glock_17",
  secondaryMagazineInstanceId: "",
  secondaryAttachments: emptyWeaponAttachments,

  headgearId: "basic_helmet",
  armorId: "soft_armor_vest",
  rigId: "scout_rig",
  carriedItems: [],
  carriedMagazines: [],
};
