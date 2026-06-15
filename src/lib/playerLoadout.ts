import {
  emptyWeaponAttachments,
  loadout,
  type CarriedItemStack,
  type CarriedMagazine,
  type CarryContainer,
  type PlayerLoadout,
  type WeaponAttachmentSlots,
} from "@/data/loadout";

const LOADOUT_STORAGE_KEY = "shadow-network-loadout";

const carryContainers: CarryContainer[] = ["pockets", "chest"];

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

function safeWeaponAttachments(value: unknown): WeaponAttachmentSlots {
  if (!value || typeof value !== "object") {
    return emptyWeaponAttachments;
  }

  const parsed = value as Record<string, unknown>;

  return {
    opticId: safeString(parsed.opticId, ""),
    barrelId: safeString(parsed.barrelId, ""),
    muzzleId: safeString(parsed.muzzleId, ""),
    underbarrelId: safeString(parsed.underbarrelId, ""),
    tacticalId: safeString(parsed.tacticalId, ""),
    stockId: safeString(parsed.stockId, ""),
  };
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

function safeCarriedMagazines(value: unknown): CarriedMagazine[] {
  if (!Array.isArray(value)) {
    return loadout.carriedMagazines;
  }

  return value
    .map((entry): CarriedMagazine | null => {
      if (!entry || typeof entry !== "object") {
        return null;
      }

      const instanceId = "instanceId" in entry ? entry.instanceId : null;
      const magazineItemId =
        "magazineItemId" in entry ? entry.magazineItemId : null;
      const loadedAmmoId = "loadedAmmoId" in entry ? entry.loadedAmmoId : "";
      const loadedRounds = "loadedRounds" in entry ? entry.loadedRounds : 0;
      const container = "container" in entry ? entry.container : null;

      if (typeof instanceId !== "string" || typeof magazineItemId !== "string") {
        return null;
      }

      return {
        instanceId,
        magazineItemId,
        loadedAmmoId: typeof loadedAmmoId === "string" ? loadedAmmoId : "",
        loadedRounds: safeNumber(loadedRounds, 0),
        container: safeContainer(container),
      };
    })
    .filter((entry): entry is CarriedMagazine => entry !== null);
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
      primaryMagazineInstanceId: safeString(parsed.primaryMagazineInstanceId, ""),
      primaryAttachments: safeWeaponAttachments(parsed.primaryAttachments),

      secondaryWeaponId: safeString(
        parsed.secondaryWeaponId ?? parsed.sidearmId,
        loadout.secondaryWeaponId
      ),
      secondaryMagazineInstanceId: safeString(parsed.secondaryMagazineInstanceId, ""),
      secondaryAttachments: safeWeaponAttachments(parsed.secondaryAttachments),

      headgearId: safeString(parsed.headgearId ?? parsed.helmetId, loadout.headgearId),
      armorId: safeString(parsed.armorId, loadout.armorId),
      rigId: safeString(parsed.rigId, loadout.rigId),
      carriedItems: safeCarriedItems(parsed.carriedItems),
      carriedMagazines: safeCarriedMagazines(parsed.carriedMagazines),
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
