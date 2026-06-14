import type { CarryContainer, PlayerLoadout } from "@/data/loadout";
import type { GameItem } from "@/data/items";
import { getItemById } from "@/lib/items";

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

  if (!item || !("stats" in item) || !item.stats) {
    return 0;
  }

  const stats = item.stats as Record<string, unknown>;
  const value = stats[statName];

  return typeof value === "number" ? value : 0;
}

export function getItemSlotCost(item: GameItem): number {
  const maybeSlotCost = "slotCost" in item ? item.slotCost : null;

  if (typeof maybeSlotCost === "number" && Number.isFinite(maybeSlotCost)) {
    return Math.max(1, Math.floor(maybeSlotCost));
  }

  if (item.category === "ammo") {
    return 1;
  }

  if (item.category === "medical") {
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
    rig: {
      used: 0,
      total: 0,
    },
    armor: {
      used: 0,
      total: 0,
    },
    backpack: {
      used: 0,
      total: 0,
    },
  };
}

function getContainerTotals(
  loadout: PlayerLoadout
): Record<CarryContainer, ContainerSlotSummary> {
  const carrySlots = createEmptyCarrySlots();

  carrySlots.rig.total = getNumberStat(loadout.rigId, "capacity");
  carrySlots.armor.total = getNumberStat(loadout.armorId, "capacity");
  carrySlots.backpack.total = getNumberStat(loadout.backpackId, "capacity");

  for (const entry of loadout.carriedItems) {
    carrySlots[entry.container].used += getCarriedItemSlotCost(
      entry.itemId,
      entry.quantity
    );
  }

  return carrySlots;
}

export function getContainerLabel(container: CarryContainer): string {
  if (container === "pockets") {
    return "Pockets";
  }

  if (container === "rig") {
    return "Rig";
  }

  if (container === "armor") {
    return "Armor";
  }

  return "Backpack";
}

export function calculateLoadoutStats(loadout: PlayerLoadout): LoadoutStats {
  const primaryWeaponDamage = getNumberStat(loadout.primaryWeaponId, "damage");
  const sidearmDamage = getNumberStat(loadout.sidearmId, "damage");

  const armorProtection = getNumberStat(loadout.armorId, "protection");
  const helmetProtection = getNumberStat(loadout.helmetId, "protection");

  return {
    combatScore: primaryWeaponDamage + sidearmDamage,
    protectionScore: armorProtection + helmetProtection,
    carrySlots: getContainerTotals(loadout),
  };
}
