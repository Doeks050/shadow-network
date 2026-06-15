"use client";

import { useEffect, useState } from "react";
import GamePage from "@/components/GamePage";
import ActionButton from "@/components/ui/ActionButton";
import Button from "@/components/ui/Button";
import Panel from "@/components/ui/Panel";
import SectionTitle from "@/components/ui/SectionTitle";
import type {
  AttachmentItem,
  AttachmentSlot,
  GameItem,
  ItemCategory,
  MagazineItem,
} from "@/data/items";
import type { WeaponItem } from "@/data/items/weapons/types";
import {
  attachmentSlotIdToAttachmentSlot,
  type CarriedItemStack,
  type CarriedMagazine,
  type CarryContainer,
  type PlayerLoadout,
  type WeaponAttachmentSlotId,
  type WeaponAttachmentSlots,
} from "@/data/loadout";
import { getItemById } from "@/lib/items";
import {
  calculateLoadoutStats,
  getContainerLabel,
  getItemSlotCost,
} from "@/lib/loadout";
import { getStoredLoadout, saveStoredLoadout } from "@/lib/playerLoadout";
import {
  getStoredStash,
  saveStoredStash,
  type StoredStashItem,
} from "@/lib/playerStash";
import {
  calculateEffectiveWeaponStats,
  calculateWeaponCombatScore,
  isAttachmentCompatibleWithWeapon,
  isMagazineCompatibleWithWeapon,
} from "@/lib/weaponStats";

type GearPanelId = "primary" | "secondary" | "headgear" | "chest";
type StoragePanelId = "pockets";

type ActivePanel =
  | {
      type: "gear";
      id: GearPanelId;
    }
  | {
      type: "storage";
      id: StoragePanelId;
    };

type GearPanel = {
  id: GearPanelId;
  label: string;
  categories: ItemCategory[];
};

const gearPanels: GearPanel[] = [
  {
    id: "primary",
    label: "Primary",
    categories: ["weapon"],
  },
  {
    id: "secondary",
    label: "Secondary",
    categories: ["weapon"],
  },
  {
    id: "headgear",
    label: "Headgear",
    categories: ["helmet"],
  },
  {
    id: "chest",
    label: "Chest",
    categories: ["armor", "rig"],
  },
];

const weaponAttachmentSlotLabels: Record<WeaponAttachmentSlotId, string> = {
  opticId: "Optic",
  barrelId: "Barrel",
  muzzleId: "Muzzle",
  underbarrelId: "Underbarrel",
  tacticalId: "Tactical Device",
  stockId: "Stock",
};

const weaponAttachmentSlotOrder: WeaponAttachmentSlotId[] = [
  "opticId",
  "barrelId",
  "muzzleId",
  "underbarrelId",
  "tacticalId",
  "stockId",
];

function createInstanceId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function getStashItemQuantity(stash: StoredStashItem[], itemId: string): number {
  return stash.find((stashItem) => stashItem.itemId === itemId)?.quantity ?? 0;
}

function updateStashQuantity(
  stash: StoredStashItem[],
  itemId: string,
  delta: number
): StoredStashItem[] {
  const currentQuantity = getStashItemQuantity(stash, itemId);
  const nextQuantity = currentQuantity + delta;

  const withoutItem = stash.filter((item) => item.itemId !== itemId);

  if (nextQuantity <= 0) {
    return withoutItem;
  }

  return [
    ...withoutItem,
    {
      itemId,
      quantity: nextQuantity,
    },
  ];
}

function getStashItemsByCategories(
  stash: StoredStashItem[],
  categories: ItemCategory[]
): GameItem[] {
  return stash
    .map((stashItem) => getItemById(stashItem.itemId))
    .filter((item): item is GameItem => item !== null)
    .filter((item) => categories.includes(item.category));
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

function getWeaponAttachments(
  loadout: PlayerLoadout,
  panelId: "primary" | "secondary"
): WeaponAttachmentSlots {
  return panelId === "primary"
    ? loadout.primaryAttachments
    : loadout.secondaryAttachments;
}

function getAttachmentIdForSlot(
  loadout: PlayerLoadout,
  panelId: "primary" | "secondary",
  slotId: WeaponAttachmentSlotId
): string {
  return getWeaponAttachments(loadout, panelId)[slotId];
}

function getAttachmentItemsForWeapon(
  loadout: PlayerLoadout,
  panelId: "primary" | "secondary"
): AttachmentItem[] {
  return weaponAttachmentSlotOrder
    .map((slotId) => getAttachmentItem(getAttachmentIdForSlot(loadout, panelId, slotId)))
    .filter((item): item is AttachmentItem => item !== null);
}

function getCompatibleAttachmentItems(
  stash: StoredStashItem[],
  weaponId: string,
  slot: AttachmentSlot
): AttachmentItem[] {
  const weapon = getWeaponItem(weaponId);

  if (!weapon) {
    return [];
  }

  return stash
    .map((stashItem) => getAttachmentItem(stashItem.itemId))
    .filter((item): item is AttachmentItem => item !== null)
    .filter((attachment) => attachment.slot === slot)
    .filter((attachment) => isAttachmentCompatibleWithWeapon(weapon, attachment))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function weaponSupportsAttachmentSlot(
  weaponId: string,
  slot: AttachmentSlot
): boolean {
  const weapon = getWeaponItem(weaponId);

  if (!weapon) {
    return false;
  }

  const allowedFamilies = weapon.attachmentFamilies[slot];

  return Array.isArray(allowedFamilies) && allowedFamilies.length > 0;
}

function setWeaponAttachment(
  loadout: PlayerLoadout,
  panelId: "primary" | "secondary",
  slotId: WeaponAttachmentSlotId,
  itemId: string
): PlayerLoadout {
  if (panelId === "primary") {
    return {
      ...loadout,
      primaryAttachments: {
        ...loadout.primaryAttachments,
        [slotId]: itemId,
      },
    };
  }

  return {
    ...loadout,
    secondaryAttachments: {
      ...loadout.secondaryAttachments,
      [slotId]: itemId,
    },
  };
}

function clearWeaponAttachment(
  loadout: PlayerLoadout,
  panelId: "primary" | "secondary",
  slotId: WeaponAttachmentSlotId
): PlayerLoadout {
  return setWeaponAttachment(loadout, panelId, slotId, "");
}

function getAttachmentModifierText(attachment: AttachmentItem): string {
  const parts: string[] = [];

  if (attachment.accuracyModifier) {
    parts.push(`ACC ${attachment.accuracyModifier > 0 ? "+" : ""}${attachment.accuracyModifier}`);
  }

  if (attachment.handlingModifier) {
    parts.push(`HDL ${attachment.handlingModifier > 0 ? "+" : ""}${attachment.handlingModifier}`);
  }

  if (attachment.recoilControlModifier) {
    parts.push(`REC ${attachment.recoilControlModifier > 0 ? "+" : ""}${attachment.recoilControlModifier}`);
  }

  if (attachment.reloadSpeedModifier) {
    parts.push(`RLD ${attachment.reloadSpeedModifier > 0 ? "+" : ""}${attachment.reloadSpeedModifier}`);
  }

  if (attachment.reliabilityModifier) {
    parts.push(`REL ${attachment.reliabilityModifier > 0 ? "+" : ""}${attachment.reliabilityModifier}`);
  }

  if (attachment.fireRateModifier) {
    parts.push(`RPM ${attachment.fireRateModifier > 0 ? "+" : ""}${attachment.fireRateModifier}`);
  }

  return parts.length > 0 ? parts.join(" · ") : "No stat modifiers";
}

function getGearItemIds(loadout: PlayerLoadout, panelId: GearPanelId): string[] {
  if (panelId === "primary") {
    return [loadout.primaryWeaponId].filter(Boolean);
  }

  if (panelId === "secondary") {
    return [loadout.secondaryWeaponId].filter(Boolean);
  }

  if (panelId === "headgear") {
    return [loadout.headgearId].filter(Boolean);
  }

  return [loadout.armorId, loadout.rigId].filter(Boolean);
}

function getAttachedMagazine(
  loadout: PlayerLoadout,
  panelId: "primary" | "secondary"
): CarriedMagazine | null {
  const instanceId =
    panelId === "primary"
      ? loadout.primaryMagazineInstanceId
      : loadout.secondaryMagazineInstanceId;

  return (
    loadout.carriedMagazines.find(
      (magazine) => magazine.instanceId === instanceId
    ) ?? null
  );
}

function getGearSummary(loadout: PlayerLoadout, panelId: GearPanelId): string {
  const itemIds = getGearItemIds(loadout, panelId);

  if (itemIds.length === 0) {
    return "Empty";
  }

  return itemIds
    .map((itemId) => getItemById(itemId)?.name ?? itemId)
    .join(" · ");
}

function getGearOwnedText(
  stash: StoredStashItem[],
  loadout: PlayerLoadout,
  panelId: GearPanelId
): string {
  const itemIds = getGearItemIds(loadout, panelId);

  if (itemIds.length === 0) {
    return "-";
  }

  return itemIds
    .map((itemId) => `x${getStashItemQuantity(stash, itemId)}`)
    .join(" · ");
}

function setGearItem(
  loadout: PlayerLoadout,
  panelId: GearPanelId,
  item: GameItem
): PlayerLoadout {
  if (panelId === "primary") {
    return {
      ...loadout,
      primaryWeaponId: item.id,
      primaryMagazineInstanceId: "",
    };
  }

  if (panelId === "secondary") {
    return {
      ...loadout,
      secondaryWeaponId: item.id,
      secondaryMagazineInstanceId: "",
    };
  }

  if (panelId === "headgear") {
    return {
      ...loadout,
      headgearId: item.id,
    };
  }

  if (item.category === "armor") {
    return {
      ...loadout,
      armorId: item.id,
    };
  }

  if (item.category === "rig") {
    return {
      ...loadout,
      rigId: item.id,
    };
  }

  return loadout;
}

function clearGearPanel(loadout: PlayerLoadout, panelId: GearPanelId): PlayerLoadout {
  if (panelId === "primary") {
    return {
      ...loadout,
      primaryWeaponId: "",
      primaryMagazineInstanceId: "",
    };
  }

  if (panelId === "secondary") {
    return {
      ...loadout,
      secondaryWeaponId: "",
      secondaryMagazineInstanceId: "",
    };
  }

  if (panelId === "headgear") {
    return {
      ...loadout,
      headgearId: "",
    };
  }

  return {
    ...loadout,
    armorId: "",
    rigId: "",
  };
}

function isGearItemSelected(
  loadout: PlayerLoadout,
  panelId: GearPanelId,
  itemId: string
): boolean {
  return getGearItemIds(loadout, panelId).includes(itemId);
}

function sortAvailableItems(items: GameItem[]): GameItem[] {
  return [...items].sort((a, b) => a.name.localeCompare(b.name));
}

function getCompatibleMagazineInstances(
  loadout: PlayerLoadout,
  weaponId: string
): CarriedMagazine[] {
  const weapon = getWeaponItem(weaponId);

  if (!weapon) {
    return [];
  }

  return loadout.carriedMagazines.filter((instance) => {
    const magazineItem = getMagazineItem(instance.magazineItemId);

    if (!magazineItem) {
      return false;
    }

    return isMagazineCompatibleWithWeapon(weapon, magazineItem);
  });
}

function attachMagazineToWeapon(
  loadout: PlayerLoadout,
  panelId: "primary" | "secondary",
  instanceId: string
): PlayerLoadout {
  if (panelId === "primary") {
    return {
      ...loadout,
      primaryMagazineInstanceId: instanceId,
    };
  }

  return {
    ...loadout,
    secondaryMagazineInstanceId: instanceId,
  };
}

function getWeaponStatsLines(
  loadout: PlayerLoadout,
  weaponId: string,
  magazineInstanceId: string
): { label: string; value: string; modifier?: number }[] {
  const weapon = getWeaponItem(weaponId);

  if (!weapon) {
    return [];
  }

  const magazineInstance = loadout.carriedMagazines.find(
    (magazine) => magazine.instanceId === magazineInstanceId
  );
  const magazineItem = magazineInstance
    ? getMagazineItem(magazineInstance.magazineItemId)
    : null;

  const attachmentItems =
    weaponId === loadout.primaryWeaponId
      ? getAttachmentItemsForWeapon(loadout, "primary")
      : getAttachmentItemsForWeapon(loadout, "secondary");

  const baseStats = calculateEffectiveWeaponStats(weapon, null, []);
  const effectiveStats = calculateEffectiveWeaponStats(
    weapon,
    magazineItem,
    attachmentItems
  );
  const score = calculateWeaponCombatScore(effectiveStats);
  const baseScore = calculateWeaponCombatScore(baseStats);

  return [
    {
      label: "Combat Score",
      value: String(score),
      modifier: score - baseScore,
    },
    {
      label: "Accuracy",
      value: String(effectiveStats.accuracy),
      modifier: effectiveStats.accuracy - baseStats.accuracy,
    },
    {
      label: "Handling",
      value: String(effectiveStats.handling),
      modifier: effectiveStats.handling - baseStats.handling,
    },
    {
      label: "Recoil Control",
      value: String(effectiveStats.recoilControl),
      modifier: effectiveStats.recoilControl - baseStats.recoilControl,
    },
    {
      label: "Reload Speed",
      value: String(effectiveStats.reloadSpeed),
      modifier: effectiveStats.reloadSpeed - baseStats.reloadSpeed,
    },
    {
      label: "Fire Rate",
      value: String(effectiveStats.fireRate),
      modifier: effectiveStats.fireRate - baseStats.fireRate,
    },
    {
      label: "Reliability",
      value: String(effectiveStats.reliability),
      modifier: effectiveStats.reliability - baseStats.reliability,
    },
    { label: "Range", value: effectiveStats.range },
    {
      label: "Capacity",
      value: String(effectiveStats.capacity),
      modifier: effectiveStats.capacity - baseStats.capacity,
    },
    {
      label: "Damage Output",
      value: `+${effectiveStats.damageOutputModifier}`,
      modifier:
        effectiveStats.damageOutputModifier - baseStats.damageOutputModifier,
    },
  ];
}

function formatModifier(modifier?: number): string {
  if (!modifier) {
    return "";
  }

  return modifier > 0 ? `+${modifier}` : String(modifier);
}

function getCarriedEntry(
  loadout: PlayerLoadout,
  itemId: string
): CarriedItemStack | null {
  return loadout.carriedItems.find((entry) => entry.itemId === itemId) ?? null;
}

function getCarriedQuantity(loadout: PlayerLoadout, itemId: string): number {
  return getCarriedEntry(loadout, itemId)?.quantity ?? 0;
}

function getCarriedContainer(
  loadout: PlayerLoadout,
  itemId: string
): CarryContainer {
  return getCarriedEntry(loadout, itemId)?.container ?? "pockets";
}

function setCarriedItem(
  loadout: PlayerLoadout,
  itemId: string,
  quantity: number,
  container: CarryContainer
): PlayerLoadout {
  const withoutItem = loadout.carriedItems.filter(
    (entry) => entry.itemId !== itemId
  );

  if (quantity <= 0) {
    return {
      ...loadout,
      carriedItems: withoutItem,
    };
  }

  return {
    ...loadout,
    carriedItems: [
      ...withoutItem,
      {
        itemId,
        quantity,
        container,
      },
    ],
  };
}

function getItemUsedSlots(item: GameItem, quantity: number): number {
  const slotCost = getItemSlotCost(item);

  if (item.category === "ammo") {
    return Math.ceil(quantity / 30) * slotCost;
  }

  return quantity * slotCost;
}

function getDefaultAddQuantity(item: GameItem, availableQuantity: number): number {
  if (availableQuantity <= 0) {
    return 0;
  }

  if (item.category === "ammo") {
    return Math.min(30, availableQuantity);
  }

  return 1;
}

function getContainerStacks(
  loadout: PlayerLoadout,
  container: CarryContainer
): CarriedItemStack[] {
  return loadout.carriedItems.filter(
    (entry) => entry.container === container && entry.quantity > 0
  );
}

function getContainerMagazines(
  loadout: PlayerLoadout,
  container: CarryContainer
): CarriedMagazine[] {
  return loadout.carriedMagazines.filter(
    (magazine) => magazine.container === container
  );
}

function getTotalUsedSlotsForContainer(
  loadout: PlayerLoadout,
  container: CarryContainer
): number {
  const itemSlots = getContainerStacks(loadout, container).reduce(
    (total, entry) => {
      const item = getItemById(entry.itemId);

      if (!item) {
        return total + entry.quantity;
      }

      return total + getItemUsedSlots(item, entry.quantity);
    },
    0
  );

  const magazineSlots = getContainerMagazines(loadout, container).reduce(
    (total, magazine) => {
      const magazineItem = getMagazineItem(magazine.magazineItemId);
      return total + (magazineItem ? getItemSlotCost(magazineItem) : 1);
    },
    0
  );

  return itemSlots + magazineSlots;
}

function getContainerPreviewText(
  loadout: PlayerLoadout,
  container: CarryContainer
): string {
  const stacks = getContainerStacks(loadout, container);
  const magazines = getContainerMagazines(loadout, container);

  if (stacks.length === 0 && magazines.length === 0) {
    return "Empty";
  }

  const stackLabels = stacks.map((entry) => {
    const item = getItemById(entry.itemId);
    return `${item?.name ?? entry.itemId} x${entry.quantity}`;
  });

  const magazineLabels = magazines.map((entry) => {
    const item = getMagazineItem(entry.magazineItemId);
    return `${item?.name ?? entry.magazineItemId} ${entry.loadedRounds}/${
      item?.capacity ?? 0
    }`;
  });

  return [...stackLabels, ...magazineLabels].join(" · ");
}

function getSlotBlocks(
  loadout: PlayerLoadout,
  container: CarryContainer,
  totalSlots: number
): string[] {
  const labels: string[] = [];

  for (const entry of getContainerStacks(loadout, container)) {
    const item = getItemById(entry.itemId);
    const usedSlots = item ? getItemUsedSlots(item, entry.quantity) : entry.quantity;
    const label = `${item?.name ?? entry.itemId} x${entry.quantity}`;

    for (let index = 0; index < usedSlots; index += 1) {
      labels.push(label);
    }
  }

  for (const magazine of getContainerMagazines(loadout, container)) {
    const magazineItem = getMagazineItem(magazine.magazineItemId);
    const usedSlots = magazineItem ? getItemSlotCost(magazineItem) : 1;
    const label = `${magazineItem?.name ?? magazine.magazineItemId} ${
      magazine.loadedRounds
    }/${magazineItem?.capacity ?? 0}`;

    for (let index = 0; index < usedSlots; index += 1) {
      labels.push(label);
    }
  }

  while (labels.length < totalSlots) {
    labels.push("Empty");
  }

  return labels;
}

function isGearPanelActive(activePanel: ActivePanel, panelId: GearPanelId): boolean {
  return activePanel.type === "gear" && activePanel.id === panelId;
}

function isStoragePanelActive(
  activePanel: ActivePanel,
  panelId: StoragePanelId
): boolean {
  return activePanel.type === "storage" && activePanel.id === panelId;
}

export default function LoadoutPage() {
  const [currentLoadout, setCurrentLoadout] = useState<PlayerLoadout | null>(
    null
  );
  const [stash, setStash] = useState<StoredStashItem[]>([]);
  const [activePanel, setActivePanel] = useState<ActivePanel>({
    type: "gear",
    id: "primary",
  });
  const [openStorageModal, setOpenStorageModal] =
    useState<CarryContainer | null>(null);
  const [openGearModal, setOpenGearModal] = useState<GearPanelId | null>(null);
  const [weaponPickerOpen, setWeaponPickerOpen] = useState(false);
  const [activeWeaponSetupSlot, setActiveWeaponSetupSlot] =
    useState<"magazine" | WeaponAttachmentSlotId>("magazine");
  const [message, setMessage] = useState<string | null>(null);

  function persistStash(nextStash: StoredStashItem[]) {
    setStash(nextStash);
    saveStoredStash(nextStash);
  }

  function refreshData() {
    setCurrentLoadout(getStoredLoadout());
    setStash(getStoredStash());
  }

  function handleSelectGearPanel(panelId: GearPanelId) {
    setActivePanel({
      type: "gear",
      id: panelId,
    });
    setOpenGearModal(panelId);
    setWeaponPickerOpen(false);
    setActiveWeaponSetupSlot("magazine");
    setMessage(null);
  }

  function handleSelectPockets() {
    setActivePanel({
      type: "storage",
      id: "pockets",
    });
    setOpenStorageModal("pockets");
    setMessage(null);
  }

  function handleOpenChestStorage() {
    setOpenStorageModal("chest");
    setMessage(null);
  }

  function handleEquipItem(panelId: GearPanelId, item: GameItem) {
    setCurrentLoadout((existingLoadout) => {
      if (!existingLoadout) {
        return existingLoadout;
      }

      return setGearItem(existingLoadout, panelId, item);
    });

    setMessage(null);
  }

  function handleClearGearPanel(panelId: GearPanelId) {
    setCurrentLoadout((existingLoadout) => {
      if (!existingLoadout) {
        return existingLoadout;
      }

      return clearGearPanel(existingLoadout, panelId);
    });

    setMessage(null);
  }

  function handleAddCarryItem(item: GameItem, container: CarryContainer) {
    if (item.category === "magazine") {
      handleAddMagazineToContainer(item as MagazineItem, container);
      return;
    }

    setCurrentLoadout((existingLoadout) => {
      if (!existingLoadout) {
        return existingLoadout;
      }

      const stats = calculateLoadoutStats(existingLoadout);
      const totalSlots = stats.carrySlots[container].total;
      const usedSlots = getTotalUsedSlotsForContainer(existingLoadout, container);
      const freeSlots = Math.max(0, totalSlots - usedSlots);

      const ownedQuantity = getStashItemQuantity(stash, item.id);
      const currentQuantity = getCarriedQuantity(existingLoadout, item.id);
      const addQuantity = getDefaultAddQuantity(
        item,
        ownedQuantity - currentQuantity
      );

      if (addQuantity <= 0) {
        return existingLoadout;
      }

      const neededSlots = getItemUsedSlots(item, addQuantity);

      if (neededSlots > freeSlots) {
        setMessage(`${getContainerLabel(container)} does not have enough free slots.`);
        return existingLoadout;
      }

      return setCarriedItem(
        existingLoadout,
        item.id,
        Math.min(ownedQuantity, currentQuantity + addQuantity),
        container
      );
    });
  }

  function handleAddMagazineToContainer(
    magazineItem: MagazineItem,
    container: CarryContainer
  ) {
    setCurrentLoadout((existingLoadout) => {
      if (!existingLoadout) {
        return existingLoadout;
      }

      const ownedQuantity = getStashItemQuantity(stash, magazineItem.id);

      if (ownedQuantity <= 0) {
        return existingLoadout;
      }

      const stats = calculateLoadoutStats(existingLoadout);
      const totalSlots = stats.carrySlots[container].total;
      const usedSlots = getTotalUsedSlotsForContainer(existingLoadout, container);
      const freeSlots = Math.max(0, totalSlots - usedSlots);
      const neededSlots = getItemSlotCost(magazineItem);

      if (neededSlots > freeSlots) {
        setMessage(`${getContainerLabel(container)} does not have enough free slots.`);
        return existingLoadout;
      }

      const nextStash = updateStashQuantity(stash, magazineItem.id, -1);
      persistStash(nextStash);

      return {
        ...existingLoadout,
        carriedMagazines: [
          ...existingLoadout.carriedMagazines,
          {
            instanceId: createInstanceId("mag"),
            magazineItemId: magazineItem.id,
            loadedAmmoId: "",
            loadedRounds: 0,
            container,
          },
        ],
      };
    });
  }

  function handleRemoveCarryItem(itemId: string) {
    setCurrentLoadout((existingLoadout) => {
      if (!existingLoadout) {
        return existingLoadout;
      }

      return setCarriedItem(
        existingLoadout,
        itemId,
        0,
        getCarriedContainer(existingLoadout, itemId)
      );
    });

    setMessage(null);
  }

  function handleRemoveMagazine(instanceId: string) {
    setCurrentLoadout((existingLoadout) => {
      if (!existingLoadout) {
        return existingLoadout;
      }

      const magazine = existingLoadout.carriedMagazines.find(
        (entry) => entry.instanceId === instanceId
      );

      if (!magazine) {
        return existingLoadout;
      }

      const nextStash = updateStashQuantity(stash, magazine.magazineItemId, 1);
      const nextStashWithAmmo =
        magazine.loadedAmmoId && magazine.loadedRounds > 0
          ? updateStashQuantity(nextStash, magazine.loadedAmmoId, magazine.loadedRounds)
          : nextStash;

      persistStash(nextStashWithAmmo);

      return {
        ...existingLoadout,
        primaryMagazineInstanceId:
          existingLoadout.primaryMagazineInstanceId === instanceId
            ? ""
            : existingLoadout.primaryMagazineInstanceId,
        secondaryMagazineInstanceId:
          existingLoadout.secondaryMagazineInstanceId === instanceId
            ? ""
            : existingLoadout.secondaryMagazineInstanceId,
        carriedMagazines: existingLoadout.carriedMagazines.filter(
          (entry) => entry.instanceId !== instanceId
        ),
      };
    });

    setMessage(null);
  }

  function handleFillMagazine(instanceId: string) {
    setCurrentLoadout((existingLoadout) => {
      if (!existingLoadout) {
        return existingLoadout;
      }

      const magazine = existingLoadout.carriedMagazines.find(
        (entry) => entry.instanceId === instanceId
      );

      if (!magazine) {
        return existingLoadout;
      }

      const magazineItem = getMagazineItem(magazine.magazineItemId);

      if (!magazineItem) {
        return existingLoadout;
      }

      const compatibleAmmo = getStashItemsByCategories(stash, ["ammo"]).find(
        (item) =>
          item.category === "ammo" &&
          "ammoType" in item &&
          item.ammoType === magazineItem.ammoType
      );

      if (!compatibleAmmo) {
        setMessage("No compatible ammo in stash.");
        return existingLoadout;
      }

      const freeRounds = Math.max(0, magazineItem.capacity - magazine.loadedRounds);
      const availableRounds = getStashItemQuantity(stash, compatibleAmmo.id);
      const roundsToLoad = Math.min(freeRounds, availableRounds);

      if (roundsToLoad <= 0) {
        setMessage("Magazine is already full or no ammo available.");
        return existingLoadout;
      }

      const nextStash = updateStashQuantity(stash, compatibleAmmo.id, -roundsToLoad);
      persistStash(nextStash);

      return {
        ...existingLoadout,
        carriedMagazines: existingLoadout.carriedMagazines.map((entry) =>
          entry.instanceId === instanceId
            ? {
                ...entry,
                loadedAmmoId: compatibleAmmo.id,
                loadedRounds: entry.loadedRounds + roundsToLoad,
              }
            : entry
        ),
      };
    });
  }

  function handleEmptyMagazine(instanceId: string) {
    setCurrentLoadout((existingLoadout) => {
      if (!existingLoadout) {
        return existingLoadout;
      }

      const magazine = existingLoadout.carriedMagazines.find(
        (entry) => entry.instanceId === instanceId
      );

      if (!magazine || !magazine.loadedAmmoId || magazine.loadedRounds <= 0) {
        return existingLoadout;
      }

      const nextStash = updateStashQuantity(
        stash,
        magazine.loadedAmmoId,
        magazine.loadedRounds
      );
      persistStash(nextStash);

      return {
        ...existingLoadout,
        carriedMagazines: existingLoadout.carriedMagazines.map((entry) =>
          entry.instanceId === instanceId
            ? {
                ...entry,
                loadedAmmoId: "",
                loadedRounds: 0,
              }
            : entry
        ),
      };
    });

    setMessage(null);
  }

  function handleAttachMagazine(panelId: "primary" | "secondary", instanceId: string) {
    setCurrentLoadout((existingLoadout) => {
      if (!existingLoadout) {
        return existingLoadout;
      }

      return attachMagazineToWeapon(existingLoadout, panelId, instanceId);
    });

    setMessage(null);
  }

  function handleSaveLoadout() {
    if (!currentLoadout) {
      return;
    }

    saveStoredLoadout(currentLoadout);
    setMessage("Loadout saved.");
  }

  useEffect(() => {
    refreshData();
  }, []);

  if (!currentLoadout) {
    return (
      <GamePage title="LOADOUT">
        <Panel>
          <p className="text-sm text-zinc-500">Loading loadout...</p>
        </Panel>
      </GamePage>
    );
  }

  const stats = calculateLoadoutStats(currentLoadout);
  const activeGearPanel =
    activePanel.type === "gear"
      ? gearPanels.find((panel) => panel.id === activePanel.id) ?? gearPanels[0]
      : null;

  const availableArmorItems = sortAvailableItems(
    getStashItemsByCategories(stash, ["armor"])
  );

  const availableRigItems = sortAvailableItems(
    getStashItemsByCategories(stash, ["rig"])
  );

  const carriedSelectableItems = getStashItemsByCategories(stash, [
    "ammo",
    "magazine",
    "medical",
  ]);

  return (
    <GamePage title="LOADOUT">
      <div className="grid gap-5">
        <Panel>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="grid gap-1">
              <SectionTitle>GEAR SETUP</SectionTitle>
              <p className="text-sm text-zinc-500">
                Primary, secondary, headgear, chest and pockets.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="rounded border border-zinc-800 bg-zinc-950 px-3 py-2">
                <span className="text-zinc-500">Combat</span>{" "}
                <span className="font-bold text-zinc-100">
                  {stats.combatScore}
                </span>
              </div>

              <div className="rounded border border-zinc-800 bg-zinc-950 px-3 py-2">
                <span className="text-zinc-500">Protection</span>{" "}
                <span className="font-bold text-zinc-100">
                  {stats.protectionScore}
                </span>
              </div>

              <ActionButton onClick={handleSaveLoadout}>Save</ActionButton>
            </div>
          </div>
        </Panel>

        {message && (
          <Panel className="border-emerald-900/60 bg-emerald-950/20">
            <p className="text-sm font-semibold text-emerald-400">{message}</p>
          </Panel>
        )}

        <div className="grid gap-5 lg:grid-cols-[430px_1fr]">
          <Panel>
            <div className="grid gap-4">
              <SectionTitle>LOADOUT</SectionTitle>

              <div className="grid gap-2">
                {gearPanels.map((panel) => {
                  const isActive = isGearPanelActive(activePanel, panel.id);
                  const summary = getGearSummary(currentLoadout, panel.id);
                  const ownedText = getGearOwnedText(stash, currentLoadout, panel.id);

                  return (
                    <button
                      key={panel.id}
                      type="button"
                      onClick={() => handleSelectGearPanel(panel.id)}
                      className={`rounded border px-3 py-4 text-left transition ${
                        isActive
                          ? "border-emerald-600 bg-emerald-950/30 shadow-[inset_3px_0_0_rgba(16,185,129,0.9)]"
                          : "border-zinc-800 bg-zinc-950 hover:border-zinc-700 hover:bg-zinc-900"
                      }`}
                    >
                      <div className="grid grid-cols-[100px_1fr_90px] items-center gap-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                          {panel.label}
                        </span>

                        <span className="truncate text-sm font-semibold text-zinc-100">
                          {summary}
                        </span>

                        <span className="text-right text-xs text-zinc-500">
                          {ownedText}
                        </span>
                      </div>
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={handleSelectPockets}
                  className={`rounded border px-3 py-4 text-left transition ${
                    isStoragePanelActive(activePanel, "pockets")
                      ? "border-emerald-600 bg-emerald-950/30 shadow-[inset_3px_0_0_rgba(16,185,129,0.9)]"
                      : "border-zinc-800 bg-zinc-950 hover:border-zinc-700 hover:bg-zinc-900"
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                      Pockets
                    </span>

                    <span className="text-xs font-bold text-zinc-400">
                      {getTotalUsedSlotsForContainer(currentLoadout, "pockets")}/
                      {stats.carrySlots.pockets.total}
                    </span>
                  </div>

                  <p className="truncate text-sm font-semibold text-zinc-100">
                    {getContainerPreviewText(currentLoadout, "pockets")}
                  </p>
                </button>
              </div>
            </div>
          </Panel>

          <Panel>
            {activeGearPanel ? (
              <div className="grid gap-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="grid gap-1">
                    <SectionTitle>{activeGearPanel.label}</SectionTitle>
                    <p className="text-sm text-zinc-500">
                      Click change to open the selection popup.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {activeGearPanel.id === "chest" && (
                      <Button active={false} onClick={handleOpenChestStorage}>
                        Chest Storage
                      </Button>
                    )}

                    <Button
                      active={false}
                      onClick={() => setOpenGearModal(activeGearPanel.id)}
                    >
                      Change
                    </Button>
                  </div>
                </div>

                <div className="rounded border border-zinc-800 bg-zinc-950 p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                      Equipped
                    </span>
                    <span className="text-xs text-zinc-600">
                      {getGearOwnedText(stash, currentLoadout, activeGearPanel.id)}
                    </span>
                  </div>

                  <p className="text-lg font-bold text-zinc-100">
                    {getGearSummary(currentLoadout, activeGearPanel.id)}
                  </p>

                  {(activeGearPanel.id === "primary" ||
                    activeGearPanel.id === "secondary") && (
                    <div className="mt-4 grid gap-3 border-t border-zinc-800 pt-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                          Magazine
                        </p>
                        <p className="text-sm font-semibold text-zinc-100">
                          {(() => {
                            const attached = getAttachedMagazine(
                              currentLoadout,
                              activeGearPanel.id
                            );
                            const item = attached
                              ? getMagazineItem(attached.magazineItemId)
                              : null;

                            return attached && item
                              ? `${item.name} — ${attached.loadedRounds}/${item.capacity}`
                              : "No magazine";
                          })()}
                        </p>
                      </div>

                      <div className="grid gap-2 rounded border border-zinc-800 bg-black/30 p-3">
                        <div className="mb-1 grid grid-cols-[1fr_70px_52px] gap-3 text-xs font-bold uppercase tracking-wider text-zinc-600">
                          <span>Stat</span>
                          <span className="text-right">Value</span>
                          <span className="text-right">Mod</span>
                        </div>

                        {getWeaponStatsLines(
                          currentLoadout,
                          activeGearPanel.id === "primary"
                            ? currentLoadout.primaryWeaponId
                            : currentLoadout.secondaryWeaponId,
                          activeGearPanel.id === "primary"
                            ? currentLoadout.primaryMagazineInstanceId
                            : currentLoadout.secondaryMagazineInstanceId
                        ).map((line) => {
                          const modifier = formatModifier(line.modifier);

                          return (
                            <div
                              key={line.label}
                              className="grid grid-cols-[1fr_70px_52px] items-center gap-3 border-t border-zinc-900 pt-2 text-sm first:border-t-0 first:pt-0"
                            >
                              <span className="truncate text-zinc-500">
                                {line.label}
                              </span>

                              <span className="text-right font-bold text-zinc-100">
                                {line.value}
                              </span>

                              <span
                                className={`text-right text-xs font-bold ${
                                  modifier
                                    ? modifier.startsWith("+")
                                      ? "text-emerald-400"
                                      : "text-red-400"
                                    : "text-zinc-700"
                                }`}
                              >
                                {modifier || "-"}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="grid gap-3 border-t border-zinc-800 pt-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                          Attachments
                        </p>

                        <div className="grid gap-2 sm:grid-cols-2">
                          {weaponAttachmentSlotOrder.map((slotId) => {
                            const panelId = activeGearPanel.id as
                              | "primary"
                              | "secondary";
                            const attachmentId = getAttachmentIdForSlot(
                              currentLoadout,
                              panelId,
                              slotId
                            );
                            const attachment = getAttachmentItem(attachmentId);

                            return (
                              <div
                                key={slotId}
                                className={`rounded border px-3 py-2 ${
                                  attachment
                                    ? "border-emerald-900/70 bg-emerald-950/20"
                                    : "border-zinc-800 bg-zinc-950"
                                }`}
                              >
                                <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                                  {weaponAttachmentSlotLabels[slotId]}
                                </p>
                                <p className="mt-1 truncate text-sm font-bold text-zinc-100">
                                  {attachment?.name ?? "Empty"}
                                </p>
                                {attachment && (
                                  <p className="mt-1 truncate text-xs text-zinc-500">
                                    {getAttachmentModifierText(attachment)}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {activeGearPanel.id === "chest" && (
                  <div className="rounded border border-zinc-800 bg-zinc-950 p-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                        Chest Storage
                      </span>
                      <span className="text-xs font-bold text-zinc-400">
                        {getTotalUsedSlotsForContainer(currentLoadout, "chest")}/
                        {stats.carrySlots.chest.total}
                      </span>
                    </div>

                    <p className="truncate text-sm font-semibold text-zinc-100">
                      {getContainerPreviewText(currentLoadout, "chest")}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid gap-3">
                <SectionTitle>Pockets</SectionTitle>
                <p className="text-sm text-zinc-500">
                  Pockets open in a dedicated storage popup.
                </p>
              </div>
            )}
          </Panel>
        </div>
      </div>

      {openGearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6">
          <div className="flex max-h-[86vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-zinc-700 bg-zinc-950 shadow-2xl">
            <div className="flex items-center justify-between gap-4 border-b border-zinc-800 bg-zinc-950 px-5 py-4">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-wider text-zinc-100">
                  {gearPanels.find((panel) => panel.id === openGearModal)?.label ??
                    "Gear"}
                </h2>
                <p className="text-xs uppercase tracking-wider text-zinc-500">
                  Select equipment from stash
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  active={false}
                  onClick={() => {
                    setCurrentLoadout((existingLoadout) => {
                      if (!existingLoadout) {
                        return existingLoadout;
                      }

                      return clearGearPanel(existingLoadout, openGearModal);
                    });
                    setMessage(null);
                  }}
                >
                  Clear
                </Button>

                <Button
                  active={false}
                  onClick={() => {
                    setOpenGearModal(null);
                    setWeaponPickerOpen(false);
                    setActiveWeaponSetupSlot("magazine");
                  }}
                >
                  Close
                </Button>
              </div>
            </div>

            <div className="grid gap-4 overflow-y-auto p-5">
              {openGearModal === "chest" ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded border border-zinc-800 bg-black/40 p-3">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                        Armor
                      </span>
                    </div>

                    <div className="grid gap-2">
                      {availableArmorItems.length > 0 ? (
                        availableArmorItems.map((item) => {
                          const quantity = getStashItemQuantity(stash, item.id);
                          const isSelected = currentLoadout.armorId === item.id;

                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => handleEquipItem("chest", item)}
                              className={`flex items-center justify-between gap-3 rounded border px-3 py-3 text-left ${
                                isSelected
                                  ? "border-emerald-700 bg-emerald-950/40"
                                  : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                              }`}
                            >
                              <div className="min-w-0">
                                <p className="truncate text-sm font-bold text-zinc-100">
                                  {item.name}
                                </p>
                                <p className="text-xs text-zinc-500">
                                  Owned x{quantity}
                                </p>
                              </div>

                              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                                {isSelected ? "Selected" : "Select"}
                              </span>
                            </button>
                          );
                        })
                      ) : (
                        <div className="rounded border border-dashed border-zinc-800 bg-zinc-950 px-3 py-6 text-center">
                          <p className="text-sm text-zinc-600">No armor.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="rounded border border-zinc-800 bg-black/40 p-3">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                        Rig
                      </span>
                    </div>

                    <div className="grid gap-2">
                      {availableRigItems.length > 0 ? (
                        availableRigItems.map((item) => {
                          const quantity = getStashItemQuantity(stash, item.id);
                          const isSelected = currentLoadout.rigId === item.id;

                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => handleEquipItem("chest", item)}
                              className={`flex items-center justify-between gap-3 rounded border px-3 py-3 text-left ${
                                isSelected
                                  ? "border-emerald-700 bg-emerald-950/40"
                                  : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                              }`}
                            >
                              <div className="min-w-0">
                                <p className="truncate text-sm font-bold text-zinc-100">
                                  {item.name}
                                </p>
                                <p className="text-xs text-zinc-500">
                                  Owned x{quantity}
                                </p>
                              </div>

                              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                                {isSelected ? "Selected" : "Select"}
                              </span>
                            </button>
                          );
                        })
                      ) : (
                        <div className="rounded border border-dashed border-zinc-800 bg-zinc-950 px-3 py-6 text-center">
                          <p className="text-sm text-zinc-600">No rig.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : openGearModal === "primary" || openGearModal === "secondary" ? (
                <div className="grid gap-4">
                  <div className="rounded border border-zinc-800 bg-black/40 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                          Weapon
                        </p>
                        <h3 className="mt-1 text-xl font-bold text-zinc-100">
                          {getGearSummary(currentLoadout, openGearModal)}
                        </h3>
                      </div>

                      <Button
                        active={weaponPickerOpen}
                        onClick={() => setWeaponPickerOpen((current) => !current)}
                      >
                        Change Weapon
                      </Button>
                    </div>

                    {weaponPickerOpen && (
                      <div className="mt-4 grid gap-2 border-t border-zinc-800 pt-4">
                        {sortAvailableItems(
                          getStashItemsByCategories(
                            stash,
                            gearPanels.find((panel) => panel.id === openGearModal)
                              ?.categories ?? []
                          )
                        ).map((item) => {
                          const quantity = getStashItemQuantity(stash, item.id);
                          const isSelected = isGearItemSelected(
                            currentLoadout,
                            openGearModal,
                            item.id
                          );

                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                handleEquipItem(openGearModal, item);
                                setWeaponPickerOpen(false);
                              }}
                              className={`flex items-center justify-between gap-3 rounded border px-3 py-3 text-left ${
                                isSelected
                                  ? "border-emerald-700 bg-emerald-950/40"
                                  : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                              }`}
                            >
                              <div className="min-w-0">
                                <p className="truncate text-sm font-bold text-zinc-100">
                                  {item.name}
                                </p>
                                <p className="text-xs text-zinc-500">
                                  Owned x{quantity}
                                </p>
                              </div>

                              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                                {isSelected ? "Selected" : "Select"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="grid gap-3 rounded border border-zinc-800 bg-black/40 p-3">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        active={activeWeaponSetupSlot === "magazine"}
                        onClick={() => setActiveWeaponSetupSlot("magazine")}
                      >
                        Magazine
                      </Button>

                      {weaponAttachmentSlotOrder.map((slotId) => {
                        const slot = attachmentSlotIdToAttachmentSlot[slotId];
                        const weaponId =
                          openGearModal === "primary"
                            ? currentLoadout.primaryWeaponId
                            : currentLoadout.secondaryWeaponId;

                        if (!weaponSupportsAttachmentSlot(weaponId, slot)) {
                          return null;
                        }

                        return (
                          <Button
                            key={slotId}
                            active={activeWeaponSetupSlot === slotId}
                            onClick={() => setActiveWeaponSetupSlot(slotId)}
                          >
                            {weaponAttachmentSlotLabels[slotId]}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {activeWeaponSetupSlot === "magazine" ? (
                    <div className="rounded border border-zinc-800 bg-black/40 p-3">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                          Magazine
                        </span>
                      </div>

                      <div className="grid gap-2">
                        {getCompatibleMagazineInstances(
                          currentLoadout,
                          openGearModal === "primary"
                            ? currentLoadout.primaryWeaponId
                            : currentLoadout.secondaryWeaponId
                        ).length > 0 ? (
                          getCompatibleMagazineInstances(
                            currentLoadout,
                            openGearModal === "primary"
                              ? currentLoadout.primaryWeaponId
                              : currentLoadout.secondaryWeaponId
                          ).map((instance) => {
                            const magazineItem = getMagazineItem(
                              instance.magazineItemId
                            );
                            const isSelected =
                              openGearModal === "primary"
                                ? currentLoadout.primaryMagazineInstanceId ===
                                  instance.instanceId
                                : currentLoadout.secondaryMagazineInstanceId ===
                                  instance.instanceId;

                            if (!magazineItem) {
                              return null;
                            }

                            return (
                              <button
                                key={instance.instanceId}
                                type="button"
                                onClick={() =>
                                  handleAttachMagazine(
                                    openGearModal,
                                    instance.instanceId
                                  )
                                }
                                className={`flex items-center justify-between gap-3 rounded border px-3 py-3 text-left ${
                                  isSelected
                                    ? "border-emerald-700 bg-emerald-950/40"
                                    : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                                }`}
                              >
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-bold text-zinc-100">
                                    {magazineItem.name}
                                  </p>
                                  <p className="text-xs text-zinc-500">
                                    {instance.loadedRounds}/{magazineItem.capacity} ·
                                    Damage Output +{magazineItem.damageOutputModifier}
                                  </p>
                                </div>

                                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                                  {isSelected ? "Attached" : "Attach"}
                                </span>
                              </button>
                            );
                          })
                        ) : (
                          <div className="rounded border border-dashed border-zinc-800 bg-zinc-950 px-3 py-6 text-center">
                            <p className="text-sm text-zinc-600">
                              No compatible magazines in carried storage.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    (() => {
                      const slotId = activeWeaponSetupSlot;
                      const slot = attachmentSlotIdToAttachmentSlot[slotId];
                      const weaponId =
                        openGearModal === "primary"
                          ? currentLoadout.primaryWeaponId
                          : currentLoadout.secondaryWeaponId;
                      const compatibleAttachments = getCompatibleAttachmentItems(
                        stash,
                        weaponId,
                        slot
                      );
                      const selectedAttachmentId = getAttachmentIdForSlot(
                        currentLoadout,
                        openGearModal,
                        slotId
                      );
                      const selectedAttachment =
                        getAttachmentItem(selectedAttachmentId);

                      return (
                        <div className="rounded border border-zinc-800 bg-black/40 p-3">
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <div>
                              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                                {weaponAttachmentSlotLabels[slotId]}
                              </span>
                              <p className="mt-1 text-sm font-semibold text-zinc-100">
                                {selectedAttachment?.name ?? "Empty"}
                              </p>
                            </div>

                            {selectedAttachmentId && (
                              <Button
                                active={false}
                                onClick={() => {
                                  setCurrentLoadout((existingLoadout) => {
                                    if (!existingLoadout) {
                                      return existingLoadout;
                                    }

                                    return clearWeaponAttachment(
                                      existingLoadout,
                                      openGearModal,
                                      slotId
                                    );
                                  });
                                  setMessage(null);
                                }}
                              >
                                Clear
                              </Button>
                            )}
                          </div>

                          <div className="grid gap-2">
                            {compatibleAttachments.length > 0 ? (
                              compatibleAttachments.map((attachment) => {
                                const quantity = getStashItemQuantity(
                                  stash,
                                  attachment.id
                                );
                                const isSelected =
                                  selectedAttachmentId === attachment.id;

                                return (
                                  <button
                                    key={attachment.id}
                                    type="button"
                                    onClick={() => {
                                      setCurrentLoadout((existingLoadout) => {
                                        if (!existingLoadout) {
                                          return existingLoadout;
                                        }

                                        return setWeaponAttachment(
                                          existingLoadout,
                                          openGearModal,
                                          slotId,
                                          attachment.id
                                        );
                                      });
                                      setMessage(null);
                                    }}
                                    className={`flex items-center justify-between gap-3 rounded border px-3 py-3 text-left ${
                                      isSelected
                                        ? "border-emerald-700 bg-emerald-950/40"
                                        : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                                    }`}
                                  >
                                    <div className="min-w-0">
                                      <p className="truncate text-sm font-bold text-zinc-100">
                                        {attachment.name}
                                      </p>
                                      <p className="text-xs text-zinc-500">
                                        Owned x{quantity}
                                      </p>
                                      <p className="text-xs text-zinc-600">
                                        {getAttachmentModifierText(attachment)}
                                      </p>
                                    </div>

                                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                                      {isSelected ? "Attached" : "Attach"}
                                    </span>
                                  </button>
                                );
                              })
                            ) : (
                              <div className="rounded border border-dashed border-zinc-800 bg-zinc-950 px-3 py-6 text-center">
                                <p className="text-sm text-zinc-600">
                                  No compatible {weaponAttachmentSlotLabels[
                                    slotId
                                  ].toLowerCase()} in stash.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()
                  )}
                </div>
              ) : (
                <div className="rounded border border-dashed border-zinc-800 bg-zinc-950 px-3 py-6 text-center">
                  <p className="text-sm text-zinc-600">
                    No editable setup for this slot.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {openStorageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6">
          <div className="flex max-h-[86vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-zinc-700 bg-zinc-950 shadow-2xl">
            <div className="flex items-center justify-between gap-4 border-b border-zinc-800 bg-zinc-950 px-5 py-4">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-wider text-zinc-100">
                  {getContainerLabel(openStorageModal)}
                </h2>
                <p className="text-xs uppercase tracking-wider text-zinc-500">
                  Storage container
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded border border-zinc-800 bg-black px-3 py-2 text-sm font-bold text-zinc-200">
                  {getTotalUsedSlotsForContainer(currentLoadout, openStorageModal)}
                  /{stats.carrySlots[openStorageModal].total}
                </div>

                <Button active={false} onClick={() => setOpenStorageModal(null)}>
                  Close
                </Button>
              </div>
            </div>

            <div className="grid gap-4 overflow-y-auto p-5">
              <div className="rounded border border-zinc-800 bg-black/40 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Slots
                  </span>
                  <span className="text-xs text-zinc-600">
                    Ammo uses 1 slot per 30 rounds
                  </span>
                </div>

                {stats.carrySlots[openStorageModal].total > 0 ? (
                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
                    {getSlotBlocks(
                      currentLoadout,
                      openStorageModal,
                      stats.carrySlots[openStorageModal].total
                    ).map((label, index) => (
                      <div
                        key={`${label}-${index}`}
                        className={`flex h-14 items-center justify-center rounded border px-2 text-center text-[11px] font-semibold leading-tight ${
                          label === "Empty"
                            ? "border-zinc-800 bg-zinc-950 text-zinc-700"
                            : "border-emerald-700 bg-emerald-950/40 text-emerald-100"
                        }`}
                      >
                        <span className="line-clamp-2">{label}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500">This storage has no slots.</p>
                )}
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded border border-zinc-800 bg-black/40 p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                      Current Items
                    </span>
                  </div>

                  <div className="grid gap-2">
                    {getContainerStacks(currentLoadout, openStorageModal).map(
                      (entry) => {
                        const item = getItemById(entry.itemId);
                        const used = item
                          ? getItemUsedSlots(item, entry.quantity)
                          : entry.quantity;

                        return (
                          <div
                            key={entry.itemId}
                            className="flex items-center justify-between gap-3 rounded border border-zinc-800 bg-zinc-950 px-3 py-2"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-zinc-100">
                                {item?.name ?? entry.itemId}
                              </p>
                              <p className="text-xs text-zinc-500">
                                x{entry.quantity} · {used} slot
                                {used === 1 ? "" : "s"}
                              </p>
                            </div>

                            <Button
                              active={false}
                              onClick={() => handleRemoveCarryItem(entry.itemId)}
                            >
                              Remove
                            </Button>
                          </div>
                        );
                      }
                    )}

                    {getContainerMagazines(currentLoadout, openStorageModal).map(
                      (instance) => {
                        const magazineItem = getMagazineItem(instance.magazineItemId);
                        const ammoItem = getItemById(instance.loadedAmmoId);

                        return (
                          <div
                            key={instance.instanceId}
                            className="grid gap-2 rounded border border-zinc-800 bg-zinc-950 px-3 py-2"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-bold text-zinc-100">
                                  {magazineItem?.name ?? instance.magazineItemId}
                                </p>
                                <p className="text-xs text-zinc-500">
                                  {instance.loadedRounds}/
                                  {magazineItem?.capacity ?? 0} ·{" "}
                                  {ammoItem?.name ?? "empty"}
                                </p>
                              </div>

                              <Button
                                active={false}
                                onClick={() =>
                                  handleRemoveMagazine(instance.instanceId)
                                }
                              >
                                Remove
                              </Button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <Button
                                active={false}
                                onClick={() =>
                                  handleFillMagazine(instance.instanceId)
                                }
                              >
                                Fill
                              </Button>
                              <Button
                                active={false}
                                onClick={() =>
                                  handleEmptyMagazine(instance.instanceId)
                                }
                              >
                                Empty
                              </Button>
                            </div>
                          </div>
                        );
                      }
                    )}

                    {getContainerStacks(currentLoadout, openStorageModal).length ===
                      0 &&
                      getContainerMagazines(currentLoadout, openStorageModal)
                        .length === 0 && (
                        <div className="rounded border border-dashed border-zinc-800 bg-zinc-950 px-3 py-6 text-center">
                          <p className="text-sm text-zinc-600">Empty</p>
                        </div>
                      )}
                  </div>
                </div>

                <div className="rounded border border-zinc-800 bg-black/40 p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                      Add From Stash
                    </span>
                  </div>

                  <div className="grid gap-2">
                    {carriedSelectableItems.length > 0 ? (
                      carriedSelectableItems.map((item) => {
                        const ownedQuantity = getStashItemQuantity(stash, item.id);
                        const carriedQuantity =
                          item.category === "magazine"
                            ? 0
                            : getCarriedQuantity(currentLoadout, item.id);
                        const remainingQuantity = ownedQuantity - carriedQuantity;
                        const isFullyCarried = remainingQuantity <= 0;

                        return (
                          <div
                            key={item.id}
                            className="flex items-center justify-between gap-3 rounded border border-zinc-800 bg-zinc-950 px-3 py-2"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-zinc-100">
                                {item.name}
                              </p>
                              <p className="text-xs text-zinc-500">
                                Owned x{ownedQuantity} ·{" "}
                                {item.category === "ammo"
                                  ? "30 rounds = 1 slot"
                                  : item.category === "magazine"
                                  ? `${getItemSlotCost(item)} slot magazine`
                                  : "1 item = 1 slot"}
                              </p>
                            </div>

                            {isFullyCarried ? (
                              <span className="text-xs uppercase tracking-wider text-zinc-600">
                                Carried
                              </span>
                            ) : (
                              <Button
                                active={false}
                                onClick={() =>
                                  handleAddCarryItem(item, openStorageModal)
                                }
                              >
                                Add
                              </Button>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="rounded border border-dashed border-zinc-800 bg-zinc-950 px-3 py-6 text-center">
                        <p className="text-sm text-zinc-600">
                          No ammo, magazines or medical in stash.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </GamePage>
  );
}
