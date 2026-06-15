import type { AttachmentItem, MagazineItem } from "@/data/items";
import type { WeaponItem } from "@/data/items/weapons/types";

export type EffectiveWeaponStats = {
  accuracy: number;
  handling: number;
  recoilControl: number;
  reloadSpeed: number;
  fireRate: number;
  range: WeaponItem["range"];
  reliability: number;
  damageOutputModifier: number;
  capacity: number;
};

function clampStat(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function modifier(
  attachments: AttachmentItem[],
  key:
    | "accuracyModifier"
    | "handlingModifier"
    | "recoilControlModifier"
    | "reloadSpeedModifier"
    | "fireRateModifier"
    | "reliabilityModifier"
): number {
  return attachments.reduce((total, attachment) => {
    const value = attachment[key];
    return total + (typeof value === "number" ? value : 0);
  }, 0);
}

export function isMagazineCompatibleWithWeapon(
  weapon: WeaponItem,
  magazine: MagazineItem
): boolean {
  return (
    weapon.ammoType === magazine.ammoType &&
    weapon.compatibleMagazineFamilies.includes(magazine.magazineFamily)
  );
}

export function isAttachmentCompatibleWithWeapon(
  weapon: WeaponItem,
  attachment: AttachmentItem
): boolean {
  const allowedFamilies = weapon.attachmentFamilies[attachment.slot];

  if (!allowedFamilies || allowedFamilies.length === 0) {
    return false;
  }

  return allowedFamilies.includes(attachment.attachmentFamily);
}

export function calculateEffectiveWeaponStats(
  weapon: WeaponItem,
  magazine: MagazineItem | null,
  attachments: AttachmentItem[] = []
): EffectiveWeaponStats {
  return {
    accuracy: clampStat(
      weapon.accuracy + modifier(attachments, "accuracyModifier")
    ),
    handling: clampStat(
      weapon.handling +
        (magazine?.handlingModifier ?? 0) +
        modifier(attachments, "handlingModifier")
    ),
    recoilControl: clampStat(
      weapon.recoilControl +
        (magazine?.recoilControlModifier ?? 0) +
        modifier(attachments, "recoilControlModifier")
    ),
    reloadSpeed: clampStat(
      weapon.reloadSpeed +
        (magazine?.reloadSpeedModifier ?? 0) +
        modifier(attachments, "reloadSpeedModifier")
    ),
    fireRate: Math.max(
      0,
      weapon.fireRate + modifier(attachments, "fireRateModifier")
    ),
    range: weapon.range,
    reliability: clampStat(
      weapon.reliability +
        (magazine?.reliabilityModifier ?? 0) +
        modifier(attachments, "reliabilityModifier")
    ),
    damageOutputModifier: magazine?.damageOutputModifier ?? 0,
    capacity: magazine?.capacity ?? 0,
  };
}

export function calculateWeaponCombatScore(stats: EffectiveWeaponStats): number {
  const rangeScore =
    stats.range === "short" ? 45 : stats.range === "medium" ? 60 : 70;

  const fireRateScore = Math.round(Math.sqrt(stats.fireRate) * 2);

  return Math.round(
    stats.accuracy * 0.2 +
      stats.handling * 0.15 +
      stats.recoilControl * 0.15 +
      stats.reloadSpeed * 0.1 +
      stats.reliability * 0.2 +
      rangeScore * 0.1 +
      fireRateScore * 0.1 +
      stats.damageOutputModifier
  );
}
