import type { AmmoType, AttachmentSlot, BaseItem } from "../types";

export type WeaponType =
  | "pistol"
  | "smg"
  | "assault_rifle"
  | "battle_rifle"
  | "marksman_rifle"
  | "sniper_rifle";

export type WeaponAttachmentFamilies = Partial<
  Record<AttachmentSlot, string[]>
>;

export type WeaponItem = BaseItem & {
  category: "weapon";
  weaponType: WeaponType;
  ammoType: AmmoType;
  weaponFamily: string;
  compatibleMagazineFamilies: string[];
  attachmentFamilies: WeaponAttachmentFamilies;
  accuracy: number;
  handling: number;
  recoilControl: number;
  reloadSpeed: number;
  fireRate: number;
  range: "short" | "medium" | "long";
  reliability: number;
};
