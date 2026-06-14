import {
  loadout,
  type CarriedItemStack,
  type CarryContainer,
  type PlayerLoadout,
} from "@/data/loadout";

const LOADOUT_STORAGE_KEY = "shadow-network-loadout";

const carryContainers: CarryContainer[] = [
  "pockets",
  "rig",
  "armor",
  "backpack",
];

function safeString(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

function safeNumber(value: unknown, fallback: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(0, Math.floor(value));
}

function safeContainer(value: unknown): CarryContainer {
  return carryContainers.includes(value as CarryContainer)
    ? (value as CarryContainer)
    : "pockets";
}

function safeCarriedItems(value: unknown): CarriedItemStack[] {
  if (!Array.isArray(value)) {
    return loadout.carriedItems;
  }

  return value
    .map((entry): CarriedItemStack | null => {
      if (!entry || typeof entry !== "object") {
        return null;
      }

      const itemId = "itemId" in entry ? entry.itemId : null;
      const quantity = "quantity" in entry ? entry.quantity : null;
      const container = "container" in entry ? entry.container : null;

      if (typeof itemId !== "string") {
        return null;
      }

      return {
        itemId,
        quantity: safeNumber(quantity, 0),
        container: safeContainer(container),
      };
    })
    .filter((entry): entry is CarriedItemStack => entry !== null)
    .filter((entry) => entry.quantity > 0);
}

export function getStoredLoadout(): PlayerLoadout {
  if (typeof window === "undefined") {
    return loadout;
  }

  const rawLoadout = window.localStorage.getItem(LOADOUT_STORAGE_KEY);

  if (!rawLoadout) {
    return loadout;
  }

  try {
    const parsed = JSON.parse(rawLoadout);

    return {
      primaryWeaponId: safeString(parsed.primaryWeaponId, loadout.primaryWeaponId),
      sidearmId: safeString(parsed.sidearmId, loadout.sidearmId),
      armorId: safeString(parsed.armorId, loadout.armorId),
      helmetId: safeString(parsed.helmetId, loadout.helmetId),
      rigId: safeString(parsed.rigId, loadout.rigId),
      backpackId: safeString(parsed.backpackId, loadout.backpackId),
      carriedItems: safeCarriedItems(parsed.carriedItems),
    };
  } catch {
    return loadout;
  }
}

export function saveStoredLoadout(nextLoadout: PlayerLoadout) {
  window.localStorage.setItem(LOADOUT_STORAGE_KEY, JSON.stringify(nextLoadout));
}

export function clearStoredLoadout() {
  window.localStorage.removeItem(LOADOUT_STORAGE_KEY);
}
