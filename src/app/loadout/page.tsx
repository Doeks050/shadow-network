"use client";

import { useEffect, useState } from "react";
import GamePage from "@/components/GamePage";
import ActionButton from "@/components/ui/ActionButton";
import Button from "@/components/ui/Button";
import Panel from "@/components/ui/Panel";
import SectionTitle from "@/components/ui/SectionTitle";
import type { GameItem, ItemCategory } from "@/data/items";
import type {
  CarriedItemStack,
  CarryContainer,
  PlayerLoadout,
} from "@/data/loadout";
import { getItemById } from "@/lib/items";
import {
  calculateLoadoutStats,
  getContainerLabel,
  getItemSlotCost,
} from "@/lib/loadout";
import { getStoredLoadout, saveStoredLoadout } from "@/lib/playerLoadout";
import { getStoredStash, type StoredStashItem } from "@/lib/playerStash";

type LoadoutSlotId =
  | "primaryWeapon"
  | "sidearm"
  | "armor"
  | "helmet"
  | "rig"
  | "backpack";

type LoadoutSlot = {
  id: LoadoutSlotId;
  label: string;
  shortLabel: string;
  itemKey: keyof PlayerLoadout;
  categories: ItemCategory[];
};

const loadoutSlots: LoadoutSlot[] = [
  {
    id: "primaryWeapon",
    label: "Primary Weapon",
    shortLabel: "Primary",
    itemKey: "primaryWeaponId",
    categories: ["weapon"],
  },
  {
    id: "sidearm",
    label: "Sidearm",
    shortLabel: "Sidearm",
    itemKey: "sidearmId",
    categories: ["weapon"],
  },
  {
    id: "armor",
    label: "Armor",
    shortLabel: "Armor",
    itemKey: "armorId",
    categories: ["armor"],
  },
  {
    id: "helmet",
    label: "Helmet",
    shortLabel: "Helmet",
    itemKey: "helmetId",
    categories: ["helmet"],
  },
  {
    id: "rig",
    label: "Rig",
    shortLabel: "Rig",
    itemKey: "rigId",
    categories: ["rig"],
  },
  {
    id: "backpack",
    label: "Backpack",
    shortLabel: "Backpack",
    itemKey: "backpackId",
    categories: ["backpack"],
  },
];

const carryContainers: CarryContainer[] = [
  "pockets",
  "rig",
  "armor",
  "backpack",
];

function getStashItemQuantity(stash: StoredStashItem[], itemId: string): number {
  return stash.find((stashItem) => stashItem.itemId === itemId)?.quantity ?? 0;
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

function getSelectedItemId(
  loadout: PlayerLoadout,
  itemKey: keyof PlayerLoadout
): string {
  const value = loadout[itemKey];

  return typeof value === "string" ? value : "";
}

function getSelectedItem(
  loadout: PlayerLoadout,
  itemKey: keyof PlayerLoadout
): GameItem | null {
  const selectedItemId = getSelectedItemId(loadout, itemKey);
  return getItemById(selectedItemId);
}

function getSelectedItemName(
  loadout: PlayerLoadout,
  itemKey: keyof PlayerLoadout
): string {
  return getSelectedItem(loadout, itemKey)?.name ?? "Empty";
}

function setSlotItem(
  loadout: PlayerLoadout,
  slot: LoadoutSlot,
  itemId: string
): PlayerLoadout {
  return {
    ...loadout,
    [slot.itemKey]: itemId,
  };
}

function sortAvailableItems(
  items: GameItem[],
  selectedItemId: string
): GameItem[] {
  return [...items].sort((a, b) => {
    if (a.id === selectedItemId) return -1;
    if (b.id === selectedItemId) return 1;
    return a.name.localeCompare(b.name);
  });
}

function clampQuantity(value: number, max: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(max, Math.floor(value)));
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
  const withoutItem = loadout.carriedItems.filter((entry) => entry.itemId !== itemId);

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

function getCarriedItems(loadout: PlayerLoadout): CarriedItemStack[] {
  return loadout.carriedItems.filter((entry) => entry.quantity > 0);
}

export default function LoadoutPage() {
  const [currentLoadout, setCurrentLoadout] = useState<PlayerLoadout | null>(
    null
  );
  const [stash, setStash] = useState<StoredStashItem[]>([]);
  const [activeSlotId, setActiveSlotId] =
    useState<LoadoutSlotId>("primaryWeapon");
  const [message, setMessage] = useState<string | null>(null);

  const activeSlot =
    loadoutSlots.find((slot) => slot.id === activeSlotId) ?? loadoutSlots[0];

  function refreshData() {
    setCurrentLoadout(getStoredLoadout());
    setStash(getStoredStash());
  }

  function handleSelectSlot(slotId: LoadoutSlotId) {
    setActiveSlotId(slotId);
    setMessage(null);
  }

  function handleEquipItem(itemId: string) {
    setCurrentLoadout((existingLoadout) => {
      if (!existingLoadout) {
        return existingLoadout;
      }

      return setSlotItem(existingLoadout, activeSlot, itemId);
    });

    setMessage(null);
  }

  function handleClearSlot() {
    setCurrentLoadout((existingLoadout) => {
      if (!existingLoadout) {
        return existingLoadout;
      }

      return setSlotItem(existingLoadout, activeSlot, "");
    });

    setMessage(null);
  }

  function handleCarriedQuantityChange(itemId: string, value: string) {
    setCurrentLoadout((existingLoadout) => {
      if (!existingLoadout) {
        return existingLoadout;
      }

      const ownedQuantity = getStashItemQuantity(stash, itemId);
      const nextQuantity = clampQuantity(Number(value), ownedQuantity);
      const currentContainer = getCarriedContainer(existingLoadout, itemId);

      return setCarriedItem(
        existingLoadout,
        itemId,
        nextQuantity,
        currentContainer
      );
    });

    setMessage(null);
  }

  function handleCarriedContainerChange(
    itemId: string,
    nextContainer: CarryContainer
  ) {
    setCurrentLoadout((existingLoadout) => {
      if (!existingLoadout) {
        return existingLoadout;
      }

      const quantity = getCarriedQuantity(existingLoadout, itemId);

      return setCarriedItem(existingLoadout, itemId, quantity, nextContainer);
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
  const activeSelectedItemId = getSelectedItemId(
    currentLoadout,
    activeSlot.itemKey
  );

  const availableItems = sortAvailableItems(
    getStashItemsByCategories(stash, activeSlot.categories),
    activeSelectedItemId
  );

  const carriedSelectableItems = getStashItemsByCategories(stash, [
    "ammo",
    "medical",
  ]);
  const carriedItems = getCarriedItems(currentLoadout);

  return (
    <GamePage title="LOADOUT">
      <div className="grid gap-5">
        <Panel>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="grid gap-1">
              <SectionTitle>GEAR SETUP</SectionTitle>
              <p className="text-sm text-zinc-500">
                Equip gear and place carried items into pockets, rig, armor or backpack.
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

              {carryContainers.map((container) => {
                const summary = stats.carrySlots[container];

                return (
                  <div
                    key={container}
                    className={`rounded border px-3 py-2 ${
                      summary.used > summary.total
                        ? "border-red-800 bg-red-950/30"
                        : "border-zinc-800 bg-zinc-950"
                    }`}
                  >
                    <span className="text-zinc-500">
                      {getContainerLabel(container)}
                    </span>{" "}
                    <span className="font-bold text-zinc-100">
                      {summary.used}/{summary.total}
                    </span>
                  </div>
                );
              })}

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
              <SectionTitle>EQUIPPED GEAR</SectionTitle>

              <div className="grid gap-2">
                {loadoutSlots.map((slot) => {
                  const selectedItemId = getSelectedItemId(
                    currentLoadout,
                    slot.itemKey
                  );
                  const selectedItemName = getSelectedItemName(
                    currentLoadout,
                    slot.itemKey
                  );
                  const ownedQuantity = selectedItemId
                    ? getStashItemQuantity(stash, selectedItemId)
                    : 0;
                  const isActive = activeSlotId === slot.id;

                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => handleSelectSlot(slot.id)}
                      className={`rounded border px-3 py-3 text-left transition ${
                        isActive
                          ? "border-emerald-600 bg-emerald-950/30 shadow-[inset_3px_0_0_rgba(16,185,129,0.9)]"
                          : "border-zinc-800 bg-zinc-950 hover:border-zinc-700 hover:bg-zinc-900"
                      }`}
                    >
                      <div className="grid grid-cols-[96px_1fr_74px] items-center gap-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                          {slot.shortLabel}
                        </span>

                        <span className="truncate text-sm font-semibold text-zinc-100">
                          {selectedItemName}
                        </span>

                        <span className="text-right text-xs text-zinc-500">
                          {selectedItemId ? `x${ownedQuantity}` : "-"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="grid gap-3 border-t border-zinc-800 pt-4">
                <SectionTitle>CARRIED SUMMARY</SectionTitle>

                {carriedItems.length > 0 ? (
                  <div className="grid gap-2">
                    {carriedItems.map((entry) => {
                      const item = getItemById(entry.itemId);
                      const usedSlots = item
                        ? getItemUsedSlots(item, entry.quantity)
                        : entry.quantity;

                      return (
                        <div
                          key={entry.itemId}
                          className="grid grid-cols-[1fr_70px_80px] items-center gap-3 rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
                        >
                          <span className="truncate font-semibold text-zinc-100">
                            {item?.name ?? entry.itemId}
                          </span>

                          <span className="text-right text-zinc-500">
                            x{entry.quantity}
                          </span>

                          <span className="text-right text-zinc-500">
                            {getContainerLabel(entry.container)} · {usedSlots}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500">No carried items.</p>
                )}
              </div>
            </div>
          </Panel>

          <Panel>
            <div className="grid gap-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="grid gap-1">
                  <SectionTitle>{activeSlot.label}</SectionTitle>
                  <p className="text-sm text-zinc-500">
                    Choose one matching stash item for this gear slot.
                  </p>
                </div>

                <Button active={false} onClick={handleClearSlot}>
                  Clear Slot
                </Button>
              </div>

              <div className="grid overflow-hidden rounded border border-zinc-800">
                <div className="grid grid-cols-[1fr_70px_90px] gap-3 border-b border-zinc-800 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  <span>Available Gear</span>
                  <span className="text-right">Owned</span>
                  <span className="text-right">Action</span>
                </div>

                {availableItems.length > 0 ? (
                  availableItems.map((item) => {
                    const quantity = getStashItemQuantity(stash, item.id);
                    const isSelected = activeSelectedItemId === item.id;

                    return (
                      <div
                        key={item.id}
                        className={`grid grid-cols-[1fr_70px_90px] items-center gap-3 border-b border-zinc-900 px-3 py-2 text-sm last:border-b-0 ${
                          isSelected ? "bg-emerald-950/20" : "bg-zinc-950"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => handleEquipItem(item.id)}
                          className="truncate text-left font-semibold text-zinc-100 hover:text-emerald-300"
                        >
                          {item.name}
                        </button>

                        <span className="text-right text-zinc-500">
                          x{quantity}
                        </span>

                        <div className="flex justify-end">
                          <Button
                            active={isSelected}
                            onClick={() => handleEquipItem(item.id)}
                          >
                            {isSelected ? "Selected" : "Select"}
                          </Button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="px-3 py-4 text-sm text-zinc-500">
                    No matching stash items available for this slot.
                  </p>
                )}
              </div>

              <div className="grid gap-3 border-t border-zinc-800 pt-4">
                <div>
                  <SectionTitle>CARRY ITEMS</SectionTitle>
                  <p className="text-sm text-zinc-500">
                    Set quantity and choose where each carried item is placed.
                  </p>
                </div>

                <div className="grid overflow-hidden rounded border border-zinc-800">
                  <div className="grid grid-cols-[1fr_70px_80px_120px_100px] gap-3 border-b border-zinc-800 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    <span>Item</span>
                    <span className="text-right">Owned</span>
                    <span className="text-right">Cost</span>
                    <span>Put In</span>
                    <span className="text-right">Carry</span>
                  </div>

                  {carriedSelectableItems.length > 0 ? (
                    carriedSelectableItems.map((item) => {
                      const ownedQuantity = getStashItemQuantity(stash, item.id);
                      const carriedQuantity = getCarriedQuantity(
                        currentLoadout,
                        item.id
                      );
                      const carriedContainer = getCarriedContainer(
                        currentLoadout,
                        item.id
                      );
                      const usedSlots = getItemUsedSlots(item, carriedQuantity);

                      return (
                        <div
                          key={item.id}
                          className="grid grid-cols-[1fr_70px_80px_120px_100px] items-center gap-3 border-b border-zinc-900 px-3 py-2 text-sm last:border-b-0"
                        >
                          <span className="truncate font-semibold text-zinc-100">
                            {item.name}
                          </span>

                          <span className="text-right text-zinc-500">
                            x{ownedQuantity}
                          </span>

                          <span className="text-right text-zinc-500">
                            {usedSlots}
                          </span>

                          <select
                            value={carriedContainer}
                            onChange={(event) =>
                              handleCarriedContainerChange(
                                item.id,
                                event.target.value as CarryContainer
                              )
                            }
                            className="rounded border border-zinc-800 bg-zinc-950 px-2 py-1 text-sm text-zinc-100 outline-none focus:border-emerald-700"
                          >
                            {carryContainers.map((container) => (
                              <option key={container} value={container}>
                                {getContainerLabel(container)}
                              </option>
                            ))}
                          </select>

                          <div className="flex justify-end">
                            <input
                              type="number"
                              min={0}
                              max={ownedQuantity}
                              value={carriedQuantity}
                              onChange={(event) =>
                                handleCarriedQuantityChange(
                                  item.id,
                                  event.target.value
                                )
                              }
                              className="w-20 rounded border border-zinc-800 bg-zinc-950 px-2 py-1 text-right text-sm text-zinc-100 outline-none focus:border-emerald-700"
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="px-3 py-4 text-sm text-zinc-500">
                      No ammo or medical items available in stash.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </GamePage>
  );
}
