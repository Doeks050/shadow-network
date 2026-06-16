"use client";

import { useEffect, useState } from "react";
import { getItemById } from "@/lib/items";
import { calculateLoadoutStats } from "@/lib/loadout";
import { getStoredLoadout, saveStoredLoadout } from "@/lib/playerLoadout";
import {
  getStoredStash,
  saveStoredStash,
  type StoredStashItem,
} from "@/lib/playerStash";
import type { AttachmentItem, GameItem, ItemCategory, MagazineItem } from "@/data/items";
import {
  attachmentSlotIdToAttachmentSlot,
  type PlayerLoadout,
  type WeaponAttachmentSlotId,
} from "@/data/loadout";
import type { WeaponItem } from "@/data/items/weapons/types";
import { isAttachmentCompatibleWithWeapon, isMagazineCompatibleWithWeapon } from "@/lib/weaponStats";

type LoadoutSlot = "primary" | "secondary" | "headgear" | "chestgear";
type WeaponSlot = "primary" | "secondary";

type WeaponRowProps = {
  label: string;
  name: string;
  caliber: string;
  visual: string;
  onClick: () => void;
};

type GearRowProps = {
  label: string;
  name: string;
  metricLabel: string;
  metricValue: string;
  icon: string;
  bar?: number;
  onClick?: () => void;
  openLabel?: string;
  onOpen?: () => void;
};

type MiniLineProps = {
  label: string;
  value: string;
  icon?: string;
  danger?: boolean;
};

const weaponAttachmentSlotLabels: Record<WeaponAttachmentSlotId, string> = {
  opticId: "Optic",
  barrelId: "Barrel",
  muzzleId: "Muzzle",
  underbarrelId: "Underbarrel",
  tacticalId: "Tactical",
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

function getDisplayName(itemId: string, fallback = "Empty"): string {
  if (!itemId) return fallback;
  return getItemById(itemId)?.name ?? itemId;
}

function getWeaponCaliber(itemId: string): string {
  const item = getItemById(itemId);

  if (!item || item.category !== "weapon") {
    return "No weapon equipped";
  }

  return item.ammoType.toUpperCase();
}

function getDurabilityText(itemId: string): string {
  const item = getItemById(itemId);

  if (!item || !("durability" in item) || typeof item.durability !== "number") {
    return "-";
  }

  return `${item.durability} / ${item.durability}`;
}

function getDurabilityBar(itemId: string): number {
  const item = getItemById(itemId);

  if (!item || !("durability" in item) || typeof item.durability !== "number") {
    return 0;
  }

  return 100;
}

function itemMatchesCategory(item: GameItem, categories: ItemCategory[]): boolean {
  return categories.includes(item.category);
}

function mergeStashItems(
  currentStash: StoredStashItem[],
  additions: StoredStashItem[]
): StoredStashItem[] {
  const merged = new Map<string, number>();

  for (const item of currentStash) {
    merged.set(item.itemId, (merged.get(item.itemId) ?? 0) + item.quantity);
  }

  for (const item of additions) {
    merged.set(item.itemId, (merged.get(item.itemId) ?? 0) + item.quantity);
  }

  return Array.from(merged.entries()).map(([itemId, quantity]) => ({
    itemId,
    quantity,
  }));
}

function getDevTestStashItems(): StoredStashItem[] {
  return [
    { itemId: "m4a1", quantity: 1 },
    { itemId: "glock_17", quantity: 1 },
    
    { itemId: "mp5", quantity: 1 },

    { itemId: "basic_helmet", quantity: 1 },
    { itemId: "soft_armor_vest", quantity: 1 },
    { itemId: "scout_rig", quantity: 1 },

    
    
    
    

    
    
    

    { itemId: "compact_scope", quantity: 1 },
    { itemId: "mini_red_dot_sight", quantity: 1 },
    { itemId: "vertical_grip", quantity: 1 },
    { itemId: "compact_flashlight", quantity: 1 },
    { itemId: "flash_hider", quantity: 1 },
    { itemId: "glock_suppressor", quantity: 1 },
    { itemId: "standard_barrel", quantity: 1 },
    { itemId: "short_barrel", quantity: 1 },
    { itemId: "precision_barrel", quantity: 1 },
    { itemId: "rifle_compensator", quantity: 1 },
    { itemId: "angled_grip", quantity: 1 },
    { itemId: "light_handstop", quantity: 1 },
    { itemId: "light_stock", quantity: 1 },
    { itemId: "stability_stock", quantity: 1 },
    { itemId: "tactical_stock", quantity: 1 },
    { itemId: "compact_reflex_sight", quantity: 1 },
    { itemId: "pistol_red_dot_sight", quantity: 1 },
    { itemId: "glock_compensator", quantity: 1 },
    { itemId: "glock_ported_compensator", quantity: 1 },
    { itemId: "compact_laser", quantity: 1 },
    { itemId: "tactical_flashlight", quantity: 1 },
    { itemId: "tactical_laser", quantity: 1 },

  ].filter((entry) => getItemById(entry.itemId) !== null);
}

function getWeaponItem(itemId: string): WeaponItem | null {
  const item = getItemById(itemId);

  if (!item || item.category !== "weapon") {
    return null;
  }

  return item as WeaponItem;
}

function getAttachmentItem(itemId: string): AttachmentItem | null {
  const item = getItemById(itemId);

  if (!item || item.category !== "attachment") {
    return null;
  }

  return item as AttachmentItem;
}

function getMagazineItem(itemId: string): MagazineItem | null {
  const item = getItemById(itemId);

  if (!item || item.category !== "magazine") {
    return null;
  }

  return item as MagazineItem;
}

function getAttachedMagazineInstanceId(
  loadout: PlayerLoadout,
  weaponSlot: WeaponSlot
): string {
  return weaponSlot === "primary"
    ? loadout.primaryMagazineInstanceId
    : loadout.secondaryMagazineInstanceId;
}

function getCompatibleMagazinesFromStash(
  stashItems: GameItem[],
  weaponId: string
): MagazineItem[] {
  const weapon = getWeaponItem(weaponId);

  if (!weapon) {
    return [];
  }

  return stashItems
    .filter((item): item is MagazineItem => item.category === "magazine")
    .filter((magazine) => isMagazineCompatibleWithWeapon(weapon, magazine))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function attachMagazine(
  loadout: PlayerLoadout,
  weaponSlot: WeaponSlot,
  magazineId: string
): PlayerLoadout {
  const instanceId = `${magazineId}_${Date.now()}`;

  const magazine = getMagazineItem(magazineId);

  if (!magazine) {
    return loadout;
  }

  const nextMagazine = {
    instanceId,
    magazineItemId: magazineId,
    loadedAmmoId: "",
    loadedRounds: 0,
    container: "chest" as const,
  };

  if (weaponSlot === "primary") {
    return {
      ...loadout,
      primaryMagazineInstanceId: instanceId,
      carriedMagazines: [...loadout.carriedMagazines, nextMagazine],
    };
  }

  return {
    ...loadout,
    secondaryMagazineInstanceId: instanceId,
    carriedMagazines: [...loadout.carriedMagazines, nextMagazine],
  };
}


function getWeaponIdForSlot(loadout: PlayerLoadout, slot: WeaponSlot): string {
  return slot === "primary" ? loadout.primaryWeaponId : loadout.secondaryWeaponId;
}

function getAttachmentIdForSlot(
  loadout: PlayerLoadout,
  weaponSlot: WeaponSlot,
  attachmentSlotId: WeaponAttachmentSlotId
): string {
  return weaponSlot === "primary"
    ? loadout.primaryAttachments[attachmentSlotId]
    : loadout.secondaryAttachments[attachmentSlotId];
}

function weaponSupportsAttachmentSlot(
  weaponId: string,
  attachmentSlotId: WeaponAttachmentSlotId
): boolean {
  const weapon = getWeaponItem(weaponId);

  if (!weapon) {
    return false;
  }

  const slot = attachmentSlotIdToAttachmentSlot[attachmentSlotId];
  const families = weapon.attachmentFamilies[slot];

  return Array.isArray(families) && families.length > 0;
}

function getCompatibleAttachmentsFromStash(
  stashItems: GameItem[],
  weaponId: string,
  attachmentSlotId: WeaponAttachmentSlotId
): AttachmentItem[] {
  const weapon = getWeaponItem(weaponId);

  if (!weapon) {
    return [];
  }

  const slot = attachmentSlotIdToAttachmentSlot[attachmentSlotId];

  return stashItems
    .filter((item): item is AttachmentItem => item.category === "attachment")
    .filter((attachment) => attachment.slot === slot)
    .filter((attachment) => isAttachmentCompatibleWithWeapon(weapon, attachment))
    .sort((a, b) => a.name.localeCompare(b.name));
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

function setWeaponAttachment(
  loadout: PlayerLoadout,
  weaponSlot: WeaponSlot,
  attachmentSlotId: WeaponAttachmentSlotId,
  attachmentId: string
): PlayerLoadout {
  if (weaponSlot === "primary") {
    return {
      ...loadout,
      primaryAttachments: {
        ...loadout.primaryAttachments,
        [attachmentSlotId]: attachmentId,
      },
    };
  }

  return {
    ...loadout,
    secondaryAttachments: {
      ...loadout.secondaryAttachments,
      [attachmentSlotId]: attachmentId,
    },
  };
}

function TopHud() {
  return (
    <header className="border-b border-zinc-900 bg-black/95">
      <div className="grid grid-cols-[42px_1fr_auto] items-center gap-2 px-3 py-1.5">
        <div className="h-10 w-10 overflow-hidden border border-lime-700/80 bg-zinc-950">
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle,rgba(132,204,22,0.12),transparent_62%)] text-xl text-zinc-500">
            ◉
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-[11px] font-black uppercase tracking-[0.12em] text-zinc-200">
              Ghostline
            </p>
            <span className="text-xs text-lime-500">▣</span>
          </div>
          <div className="mt-0.5 flex items-center gap-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Lv. 36
            </p>
            <div className="h-1 w-16 bg-zinc-800">
              <div className="h-full w-1/3 bg-lime-500" />
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[10px] font-black uppercase tracking-wider text-zinc-600">
            Cash
          </p>
          <p className="mt-1 text-sm font-bold tabular-nums text-zinc-200">
            $1,248,750
          </p>
        </div>
      </div>
    </header>
  );
}

function TitleBlock() {
  return (
    <section className="px-3 pt-3">
      <div className="flex items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 bg-lime-500" />
          <h1 className="text-3xl font-black uppercase leading-none tracking-[0.08em] text-zinc-100">
            Loadout
          </h1>
        </div>
      </div>
    </section>
  );
}

function Panel({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`overflow-hidden border border-zinc-800 bg-black/55 shadow-[inset_0_0_26px_rgba(255,255,255,0.018)] ${className}`}
    >
      {title && (
        <div className="border-b border-zinc-800/80 bg-black/45 px-3 py-1.5">
          <p className="text-[10px] font-black uppercase tracking-[0.17em] text-lime-500">
            {title}
          </p>
        </div>
      )}
      {children}
    </section>
  );
}

function WeaponRow({ label, name, caliber, visual, onClick }: WeaponRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid min-h-[74px] w-full grid-cols-[1fr_104px_18px] items-center gap-2 border-b border-zinc-800/75 bg-black/20 px-3 py-2 text-left last:border-b-0 active:bg-zinc-900"
    >
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-lime-500">
          {label}
        </p>
        <p className="mt-1 truncate text-lg font-semibold uppercase tracking-wide text-zinc-100">
          {name}
        </p>
        <p className="mt-0.5 text-xs font-medium text-zinc-500">{caliber}</p>
      </div>

      <div className="flex h-14 items-center justify-center overflow-hidden border border-zinc-800 bg-black/45">
        <span className="text-3xl leading-none text-zinc-500">{visual}</span>
      </div>

      <span className="text-2xl font-light leading-none text-zinc-500">›</span>
    </button>
  );
}

function GearRow({
  label,
  name,
  metricLabel,
  metricValue,
  icon,
  bar,
  onClick,
  openLabel,
  onOpen,
}: GearRowProps) {
  return (
    <div className="grid min-h-[56px] w-full grid-cols-[40px_1fr_66px_auto] items-center gap-2 border-b border-zinc-800/75 bg-black/20 px-3 py-1.5 text-left last:border-b-0">
      <button
        type="button"
        onClick={onClick}
        className="flex h-8 w-8 items-center justify-center bg-black/40 text-sm text-zinc-500 active:bg-zinc-900"
      >
        {icon}
      </button>

      <button type="button" onClick={onClick} className="min-w-0 text-left">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-lime-500">
          {label}
        </p>
        <p className="mt-1 truncate text-base font-medium text-zinc-100">{name}</p>
      </button>

      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500">
          {metricLabel}
        </p>
        <p className="mt-1 text-sm font-semibold tabular-nums text-zinc-100">
          {metricValue}
        </p>
        {typeof bar === "number" && (
          <div className="mt-1 h-1 bg-zinc-800">
            <div className="h-full bg-lime-500" style={{ width: `${bar}%` }} />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {openLabel && onOpen && (
          <button
            type="button"
            onClick={onOpen}
            className="border border-zinc-800 bg-black px-2 py-1 text-[10px] font-black uppercase tracking-wider text-lime-500 active:bg-zinc-900"
          >
            {openLabel}
          </button>
        )}
        <button
          type="button"
          onClick={onClick}
          className="text-xl font-light text-zinc-500 active:text-lime-500"
        >
          ›
        </button>
      </div>
    </div>
  );
}

function MiniLine({ label, value, icon, danger }: MiniLineProps) {
  return (
    <div className="grid grid-cols-[20px_1fr_auto] items-center gap-2 border-b border-zinc-900 px-3 py-1.5 last:border-b-0">
      <span className="text-sm text-zinc-500">{icon ?? "•"}</span>
      <p className="truncate text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p
        className={`text-sm font-semibold tabular-nums ${
          danger ? "text-orange-500" : "text-zinc-200"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function BottomNav() {
  const items = [
    ["⌂", "Home"],
    ["▰", "Loadout"],
    ["▣", "Stash"],
    ["⇄", "Traders"],
    ["⌖", "Missions"],
    ["•••", "More"],
  ];

  return (
    <nav className="border-t border-zinc-900 bg-black">
      <div className="grid grid-cols-6">
        {items.map(([icon, label]) => {
          const active = label === "Loadout";

          return (
            <button
              key={label}
              type="button"
              className={`flex min-h-[54px] flex-col items-center justify-center gap-1 border-r border-zinc-900 last:border-r-0 ${
                active
                  ? "bg-lime-950/25 text-lime-400 shadow-[inset_0_2px_0_rgba(132,204,22,0.75)]"
                  : "text-zinc-600"
              }`}
            >
              <span className="text-base leading-none">{icon}</span>
              <span className="text-[10px] font-black uppercase tracking-wider">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function getSelectionTitle(slot: LoadoutSlot): string {
  if (slot === "primary") return "Primary Weapon";
  if (slot === "secondary") return "Secondary Weapon";
  if (slot === "headgear") return "Headgear";
  return "Chestgear";
}

function getSelectionCategories(slot: LoadoutSlot): ItemCategory[] {
  if (slot === "primary" || slot === "secondary") return ["weapon"];
  if (slot === "headgear") return ["helmet"];
  return ["armor", "rig"];
}

export default function LoadoutV2Page() {
  const [currentLoadout, setCurrentLoadout] = useState<PlayerLoadout | null>(null);
  const [stashItems, setStashItems] = useState<GameItem[]>([]);
  const [activeSlot, setActiveSlot] = useState<LoadoutSlot | null>(null);
  const [customizeSlot, setCustomizeSlot] = useState<WeaponSlot | null>(null);
  const [activeAttachmentSlot, setActiveAttachmentSlot] =
    useState<WeaponAttachmentSlotId>("opticId");

  function refreshStashItems() {
    const storedStash = getStoredStash();
    const mappedItems = storedStash
      .map((entry) => getItemById(entry.itemId))
      .filter((item): item is GameItem => item !== null);

    setStashItems(mappedItems);
  }

  useEffect(() => {
    setCurrentLoadout(getStoredLoadout());
    refreshStashItems();
  }, []);

  if (!currentLoadout) {
    return (
      <main className="min-h-screen bg-black text-zinc-100">
        <div className="mx-auto flex min-h-screen w-full max-w-[430px] items-center justify-center bg-black px-4">
          <p className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Loading loadout...
          </p>
        </div>
      </main>
    );
  }

  const stats = calculateLoadoutStats(currentLoadout);
  const chestSlots = stats.carrySlots.chest;
  const selectionItems = activeSlot
    ? stashItems.filter((item) =>
        itemMatchesCategory(item, getSelectionCategories(activeSlot))
      )
    : [];

  function updateLoadout(nextLoadout: PlayerLoadout) {
    setCurrentLoadout(nextLoadout);
    saveStoredLoadout(nextLoadout);
  }

  function handleSeedTestStash() {
    const nextStash = mergeStashItems(getStoredStash(), getDevTestStashItems());
    saveStoredStash(nextStash);
    refreshStashItems();
  }

  function handleSelectItem(slot: LoadoutSlot, item: GameItem) {
    if (!currentLoadout) return;

    if (slot === "primary" && item.category === "weapon") {
      updateLoadout({
        ...currentLoadout,
        primaryWeaponId: item.id,
        primaryMagazineInstanceId: "",
      });
    }

    if (slot === "secondary" && item.category === "weapon") {
      updateLoadout({
        ...currentLoadout,
        secondaryWeaponId: item.id,
        secondaryMagazineInstanceId: "",
      });
    }

    if (slot === "headgear" && item.category === "helmet") {
      updateLoadout({
        ...currentLoadout,
        headgearId: item.id,
      });
    }

    if (slot === "chestgear" && item.category === "armor") {
      updateLoadout({
        ...currentLoadout,
        armorId: item.id,
      });
    }

    if (slot === "chestgear" && item.category === "rig") {
      updateLoadout({
        ...currentLoadout,
        rigId: item.id,
      });
    }
  }

  return (
    <main className="min-h-screen bg-black text-zinc-100">
      <div className="mx-auto min-h-screen w-full max-w-[430px] bg-[radial-gradient(circle_at_top,rgba(63,63,70,0.22),transparent_35%),linear-gradient(180deg,#020202_0%,#090909_100%)]">
        <TopHud />

        <div className="grid gap-2 pb-2">
          <TitleBlock />

          <div className="px-3">
            <button
              type="button"
              onClick={handleSeedTestStash}
              className="w-full border border-zinc-800 bg-black/45 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500 active:bg-zinc-900"
            >
              Dev: Add test gear to stash
            </button>
          </div>

          <div className="grid gap-2 px-3">
            <Panel>
              <WeaponRow
                label="Primary Weapon"
                name={getDisplayName(currentLoadout.primaryWeaponId)}
                caliber={getWeaponCaliber(currentLoadout.primaryWeaponId)}
                visual="▰"
                onClick={() => setActiveSlot("primary")}
              />
              <WeaponRow
                label="Secondary Weapon"
                name={getDisplayName(currentLoadout.secondaryWeaponId)}
                caliber={getWeaponCaliber(currentLoadout.secondaryWeaponId)}
                visual="▰"
                onClick={() => setActiveSlot("secondary")}
              />
            </Panel>

            <Panel>
              <GearRow
                label="Headgear"
                name={getDisplayName(currentLoadout.headgearId)}
                metricLabel="Durability"
                metricValue={getDurabilityText(currentLoadout.headgearId)}
                icon="◖"
                bar={getDurabilityBar(currentLoadout.headgearId)}
                onClick={() => setActiveSlot("headgear")}
              />
              <GearRow
                label="Chestgear"
                name={`${getDisplayName(currentLoadout.armorId)} · ${getDisplayName(
                  currentLoadout.rigId
                )}`}
                metricLabel="Slots"
                metricValue={`${chestSlots.used} / ${chestSlots.total}`}
                icon="▤"
                bar={getDurabilityBar(currentLoadout.armorId)}
                onClick={() => setActiveSlot("chestgear")}
                openLabel="Open"
                onOpen={() => alert("Chest storage koppelen we in de volgende stap.")}
              />
              <GearRow
                label="Backpack"
                name="Small Backpack"
                metricLabel="Slots"
                metricValue="0 / 8"
                icon="▧"
                openLabel="Open"
                onOpen={() => alert("Backpack storage komt later, want dit zit nog niet in PlayerLoadout.")}
              />
              <GearRow
                label="Pouch"
                name="Gamma"
                metricLabel="Slots"
                metricValue="0 / 4"
                icon="▣"
                openLabel="Open"
                onOpen={() => alert("Pouch komt later als apart systeem.")}
              />
            </Panel>

            <Panel title="Loadout Stats">
              <div className="grid grid-cols-2">
                <MiniLine icon="♜" label="Combat" value={String(stats.combatScore)} />
                <MiniLine icon="◆" label="Armor" value={String(stats.protectionScore)} />
                <MiniLine
                  icon="▤"
                  label="Chest"
                  value={`${chestSlots.used} / ${chestSlots.total}`}
                />
                <MiniLine icon="▧" label="Backpack" value="0 / 8" />
              </div>
            </Panel>
          </div>

          <button
            type="button"
            onClick={() => currentLoadout && saveStoredLoadout(currentLoadout)}
            className="mx-3 border border-lime-700/80 bg-lime-950/25 px-4 py-3 text-center text-xl font-black uppercase tracking-[0.16em] text-lime-400 shadow-[inset_0_0_22px_rgba(132,204,22,0.16)] active:bg-lime-900/35"
          >
            Confirm Loadout
          </button>
        </div>

        <BottomNav />

        {customizeSlot && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80">
            <div className="w-full max-w-[430px] border-t border-zinc-700 bg-zinc-950 shadow-2xl">
              <div className="border-b border-zinc-800 px-4 py-3">
                <div className="mx-auto mb-3 h-1.5 w-12 bg-zinc-700" />
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-lime-500">
                      Customize
                    </p>
                    <h2 className="truncate text-xl font-black uppercase tracking-wider text-zinc-100">
                      {getDisplayName(getWeaponIdForSlot(currentLoadout, customizeSlot))}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCustomizeSlot(null)}
                    className="border border-zinc-800 bg-black px-3 py-2 text-xs font-black uppercase tracking-wider text-zinc-400"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="grid gap-3 p-3">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  <button
                    type="button"
                    onClick={() => setActiveAttachmentSlot("magazineId" as WeaponAttachmentSlotId)}
                    className={`shrink-0 border px-3 py-2 text-[10px] font-black uppercase tracking-wider ${
                      (activeAttachmentSlot as string) === "magazineId"
                        ? "border-lime-700 bg-lime-950/25 text-lime-400"
                        : "border-zinc-800 bg-black text-zinc-500"
                    }`}
                  >
                    Magazine
                  </button>

                  {weaponAttachmentSlotOrder.map((slotId) => {
                    const weaponId = getWeaponIdForSlot(currentLoadout, customizeSlot);

                    if (!weaponSupportsAttachmentSlot(weaponId, slotId)) {
                      return null;
                    }

                    const selectedAttachment = getAttachmentItem(
                      getAttachmentIdForSlot(currentLoadout, customizeSlot, slotId)
                    );

                    return (
                      <button
                        key={slotId}
                        type="button"
                        onClick={() => setActiveAttachmentSlot(slotId)}
                        className={`shrink-0 border px-3 py-2 text-[10px] font-black uppercase tracking-wider ${
                          activeAttachmentSlot === slotId
                            ? "border-lime-700 bg-lime-950/25 text-lime-400"
                            : "border-zinc-800 bg-black text-zinc-500"
                        }`}
                      >
                        {weaponAttachmentSlotLabels[slotId]}
                        <span className="ml-2 text-zinc-600">
                          {selectedAttachment ? "●" : "○"}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {(() => {
                  const weaponId = getWeaponIdForSlot(currentLoadout, customizeSlot);

                  if ((activeAttachmentSlot as string) === "magazineId") {
                    const selectedInstanceId = getAttachedMagazineInstanceId(
                      currentLoadout,
                      customizeSlot
                    );
                    const selectedMagazine = currentLoadout.carriedMagazines.find(
                      (magazine) => magazine.instanceId === selectedInstanceId
                    );
                    const selectedMagazineItem = selectedMagazine
                      ? getMagazineItem(selectedMagazine.magazineItemId)
                      : null;
                    const compatibleMagazines = getCompatibleMagazinesFromStash(
                      stashItems,
                      weaponId
                    );

                    return (
                      <div className="grid gap-3">
                        <div className="border border-zinc-800 bg-black/45 px-3 py-3">
                          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-600">
                            Current Magazine
                          </p>
                          <p className="mt-2 truncate text-base font-bold uppercase tracking-wide text-zinc-100">
                            {selectedMagazineItem
                              ? `${selectedMagazineItem.name} · ${selectedMagazine?.loadedRounds ?? 0}/${selectedMagazineItem.capacity}`
                              : "No magazine"}
                          </p>
                        </div>

                        <div className="max-h-[42vh] overflow-y-auto">
                          {compatibleMagazines.length > 0 ? (
                            <div className="grid gap-2">
                              {compatibleMagazines.map((magazine) => (
                                <button
                                  key={magazine.id}
                                  type="button"
                                  onClick={() =>
                                    updateLoadout(
                                      attachMagazine(currentLoadout, customizeSlot, magazine.id)
                                    )
                                  }
                                  className="border border-zinc-800 bg-black/45 px-3 py-3 text-left active:bg-zinc-900"
                                >
                                  <div className="flex items-center justify-between gap-3">
                                    <p className="truncate text-base font-bold uppercase tracking-wide text-zinc-100">
                                      {magazine.name}
                                    </p>
                                    <span className="text-[10px] font-black uppercase tracking-wider text-lime-400">
                                      Attach
                                    </span>
                                  </div>
                                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-zinc-600">
                                    {magazine.capacity} rounds · DMG +{magazine.damageOutputModifier} · HDL {magazine.handlingModifier}
                                  </p>
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="border border-dashed border-zinc-800 bg-black/30 px-4 py-8 text-center">
                              <p className="text-sm font-semibold text-zinc-600">
                                No compatible magazines in stash.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }

                  if (!weaponSupportsAttachmentSlot(weaponId, activeAttachmentSlot)) {
                    return (
                      <div className="border border-dashed border-zinc-800 bg-black/30 px-4 py-8 text-center">
                        <p className="text-sm font-semibold text-zinc-600">
                          This weapon does not support this slot.
                        </p>
                      </div>
                    );
                  }

                  const selectedAttachmentId = getAttachmentIdForSlot(
                    currentLoadout,
                    customizeSlot,
                    activeAttachmentSlot
                  );
                  const selectedAttachment = getAttachmentItem(selectedAttachmentId);
                  const compatibleAttachments = getCompatibleAttachmentsFromStash(
                    stashItems,
                    weaponId,
                    activeAttachmentSlot
                  );

                  return (
                    <div className="grid gap-3">
                      <div className="border border-zinc-800 bg-black/45 px-3 py-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-600">
                          Current {weaponAttachmentSlotLabels[activeAttachmentSlot]}
                        </p>
                        <div className="mt-2 flex items-center justify-between gap-3">
                          <p className="truncate text-base font-bold uppercase tracking-wide text-zinc-100">
                            {selectedAttachment?.name ?? "Empty"}
                          </p>

                          {selectedAttachment && (
                            <button
                              type="button"
                              onClick={() =>
                                updateLoadout(
                                  setWeaponAttachment(
                                    currentLoadout,
                                    customizeSlot,
                                    activeAttachmentSlot,
                                    ""
                                  )
                                )
                              }
                              className="border border-zinc-800 bg-zinc-950 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-zinc-400"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="max-h-[42vh] overflow-y-auto">
                        {compatibleAttachments.length > 0 ? (
                          <div className="grid gap-2">
                            {compatibleAttachments.map((attachment) => {
                              const isSelected = selectedAttachmentId === attachment.id;

                              return (
                                <button
                                  key={attachment.id}
                                  type="button"
                                  onClick={() =>
                                    updateLoadout(
                                      setWeaponAttachment(
                                        currentLoadout,
                                        customizeSlot,
                                        activeAttachmentSlot,
                                        attachment.id
                                      )
                                    )
                                  }
                                  className={`border px-3 py-3 text-left ${
                                    isSelected
                                      ? "border-lime-700 bg-lime-950/25"
                                      : "border-zinc-800 bg-black/45 active:bg-zinc-900"
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-3">
                                    <p className="truncate text-base font-bold uppercase tracking-wide text-zinc-100">
                                      {attachment.name}
                                    </p>
                                    <span className="text-[10px] font-black uppercase tracking-wider text-lime-400">
                                      {isSelected ? "Attached" : "Attach"}
                                    </span>
                                  </div>
                                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-zinc-600">
                                    {getAttachmentModifierText(attachment)}
                                  </p>
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="border border-dashed border-zinc-800 bg-black/30 px-4 py-8 text-center">
                            <p className="text-sm font-semibold text-zinc-600">
                              No compatible attachments in stash.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {activeSlot && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80">
            <div className="w-full max-w-[430px] border-t border-zinc-700 bg-zinc-950 shadow-2xl">
              <div className="border-b border-zinc-800 px-4 py-3">
                <div className="mx-auto mb-3 h-1.5 w-12 bg-zinc-700" />
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-lime-500">
                      Select
                    </p>
                    <h2 className="text-xl font-black uppercase tracking-wider text-zinc-100">
                      {getSelectionTitle(activeSlot)}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveSlot(null)}
                    className="border border-zinc-800 bg-black px-3 py-2 text-xs font-black uppercase tracking-wider text-zinc-400"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="max-h-[58vh] overflow-y-auto p-3">
                {selectionItems.length > 0 ? (
                  <div className="grid gap-2">
                    {selectionItems.map((item) => (
                      <div
                        key={item.id}
                        className="grid grid-cols-[1fr_auto] items-center gap-3 border border-zinc-800 bg-black/45 px-3 py-3"
                      >
                        <button
                          type="button"
                          onClick={() => handleSelectItem(activeSlot, item)}
                          className="min-w-0 text-left"
                        >
                          <p className="truncate text-base font-bold uppercase tracking-wide text-zinc-100">
                            {item.name}
                          </p>
                          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-zinc-600">
                            {item.category} · ${item.value}
                          </p>
                        </button>

                        {item.category === "weapon" ? (
                          <button
                            type="button"
                            onClick={() => {
                              if (activeSlot === "primary" || activeSlot === "secondary") {
                                setCustomizeSlot(activeSlot);
                                setActiveSlot(null);
                                setActiveAttachmentSlot("opticId");
                              }
                            }}
                            className="border border-lime-800/80 bg-lime-950/20 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-lime-400"
                          >
                            Customize
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSelectItem(activeSlot, item)}
                            className="border border-zinc-800 bg-zinc-950 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-zinc-400"
                          >
                            Equip
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border border-dashed border-zinc-800 bg-black/30 px-4 py-8 text-center">
                    <p className="text-sm font-semibold text-zinc-600">
                      No matching items in stash.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
