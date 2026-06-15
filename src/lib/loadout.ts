import type {
  CarryContainer,
  PlayerLoadout,
  WeaponAttachmentSlots,
} from "@/data/loadout";
import type { AttachmentItem, GameItem, MagazineItem } from "@/data/items";
import type { WeaponItem } from "@/data/items/weapons/types";
import { getItemById } from "@/lib/items";
import {
  calculateEffectiveWeaponStats,
  calculateWeaponCombatScore,
} from "@/lib/weaponStats";

export type ContainerSlotSummary = {
  used: number;
  total: number;
};

export type LoadoutStats = {
  combatScore: number;
  protectionScore: number;
  carrySlots: Record<CarryContainer, ContainerSlotSummary>;
};

const basePocketSlots = 4;

function getNumberStat(itemId: string, statName: string): number {
  const item = getItemById(itemId);

  if (!item) {
    return 0;
  }

  const itemRecord = item as unknown as Record<string, unknown>;
  const directValue = itemRecord[statName];

  if (typeof directValue === "number" && Number.isFinite(directValue)) {
    return directValue;
  }

  const stats = itemRecord.stats;

  if (!stats || typeof stats !== "object") {
    return 0;
  }

  const statsRecord = stats as Record<string, unknown>;
  const statsValue = statsRecord[statName];

  return typeof statsValue === "number" && Number.isFinite(statsValue)
    ? statsValue
    : 0;
}

function getWeaponItem(itemId: string): WeaponItem | null {
  const item = getItemById(itemId);

  if (!item || item.category !== "weapon") {
    return null;
  }

  return item as WeaponItem;
}

function getMagazineItem(itemId: string): MagazineItem | null {
  const item = getItemById(itemId);

  if (!item || item.category !== "magazine") {
    return null;
  }

  return item as MagazineItem;
}

function getAttachmentItem(itemId: string): AttachmentItem | null {
  const item = getItemById(itemId);

  if (!item || item.category !== "attachment") {
    return null;
  }

  return item as AttachmentItem;
}

function getAttachedMagazineItem(
  loadout: PlayerLoadout,
  instanceId: string
): MagazineItem | null {
  if (!instanceId) {
    return null;
  }

  const instance = loadout.carriedMagazines.find(
    (magazine) => magazine.instanceId === instanceId
  );

  if (!instance) {
    return null;
  }

  return getMagazineItem(instance.magazineItemId);
}

function getAttachmentItems(slots: WeaponAttachmentSlots): AttachmentItem[] {
  return Object.values(slots)
    .map((itemId) => getAttachmentItem(itemId))
    .filter((item): item is AttachmentItem => item !== null);
}

export function getItemSlotCost(item: GameItem): number {
  const itemRecord = item as unknown as Record<string, unknown>;
  const maybeSlotCost = itemRecord.slotCost;

  if (typeof maybeSlotCost === "number" && Number.isFinite(maybeSlotCost)) {
    return Math.max(1, Math.floor(maybeSlotCost));
  }

  if (item.category === "ammo") {
    return 1;
  }

  if (item.category === "medical") {
    return 1;
  }

  if (item.category === "magazine") {
    return 1;
  }

  return 1;
}

function getCarriedItemSlotCost(itemId: string, quantity: number): number {
  const item = getItemById(itemId);

  if (!item) {
    return quantity;
  }

  const slotCost = getItemSlotCost(item);

  if (item.category === "ammo") {
    return Math.ceil(quantity / 30) * slotCost;
  }

  return quantity * slotCost;
}

function createEmptyCarrySlots(): Record<CarryContainer, ContainerSlotSummary> {
  return {
    pockets: {
      used: 0,
      total: basePocketSlots,
    },
    chest: {
      used: 0,
      total: 0,
    },
  };
}

function getContainerTotals(
  loadout: PlayerLoadout
): Record<CarryContainer, ContainerSlotSummary> {
  const carrySlots = createEmptyCarrySlots();

  carrySlots.chest.total =
    getNumberStat(loadout.rigId, "slots") + getNumberStat(loadout.armorId, "slots");

  for (const entry of loadout.carriedItems) {
    carrySlots[entry.container].used += getCarriedItemSlotCost(
      entry.itemId,
      entry.quantity
    );
  }

  for (const magazine of loadout.carriedMagazines) {
    const magazineItem = getMagazineItem(magazine.magazineItemId);
    carrySlots[magazine.container].used += magazineItem
      ? getItemSlotCost(magazineItem)
      : 1;
  }

  return carrySlots;
}

export function getContainerLabel(container: CarryContainer): string {
  if (container === "pockets") {
    return "Pockets";
  }

  return "Chest";
}

function calculateWeaponSlotScore(
  loadout: PlayerLoadout,
  weaponId: string,
  magazineInstanceId: string,
  attachments: WeaponAttachmentSlots
): number {
  const weapon = getWeaponItem(weaponId);

  if (!weapon) {
    return 0;
  }

  const magazine = getAttachedMagazineItem(loadout, magazineInstanceId);
  const attachmentItems = getAttachmentItems(attachments);
  const effectiveStats = calculateEffectiveWeaponStats(
    weapon,
    magazine,
    attachmentItems
  );

  return calculateWeaponCombatScore(effectiveStats);
}

export function calculateLoadoutStats(loadout: PlayerLoadout): LoadoutStats {
  const primaryScore = calculateWeaponSlotScore(
    loadout,
    loadout.primaryWeaponId,
    loadout.primaryMagazineInstanceId,
    loadout.primaryAttachments
  );

  const secondaryScore = calculateWeaponSlotScore(
    loadout,
    loadout.secondaryWeaponId,
    loadout.secondaryMagazineInstanceId,
    loadout.secondaryAttachments
  );

  const armorProtection = getNumberStat(loadout.armorId, "protection");
  const headgearProtection = getNumberStat(loadout.headgearId, "protection");

  return {
    combatScore: primaryScore + secondaryScore,
    protectionScore: armorProtection + headgearProtection,
    carrySlots: getContainerTotals(loadout),
  };
}
