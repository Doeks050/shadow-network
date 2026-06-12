"use client";

import { useState } from "react";
import GamePage from "@/components/GamePage";
import Button from "@/components/ui/Button";
import ItemCard from "@/components/ui/ItemCard";
import { items } from "@/data/items";
import type { GameItem, ItemCategory } from "@/data/items";

const filters: Array<{ label: string; value: ItemCategory | "all" }> = [
  { label: "All", value: "all" },
  { label: "Weapons", value: "weapon" },
  { label: "Ammo", value: "ammo" },
  { label: "Armor", value: "armor" },
  { label: "Helmets", value: "helmet" },
  { label: "Rigs", value: "rig" },
  { label: "Backpacks", value: "backpack" },
  { label: "Medical", value: "medical" },
  { label: "Attachments", value: "attachment" },
  { label: "Valuables", value: "valuable" },
  { label: "Key Items", value: "key_item" },
  { label: "Loot", value: "loot" },
];

function ItemStats({ item }: { item: GameItem }) {
  if (item.category === "weapon") {
    return (
      <>
        <p className="text-sm text-zinc-400">Type: {item.weaponType}</p>
        <p className="text-sm text-zinc-400">Ammo: {item.ammoType}</p>
        <p className="text-sm text-zinc-400">Accuracy: {item.accuracy}</p>
        <p className="text-sm text-zinc-400">Range: {item.range}</p>
        <p className="text-sm text-zinc-400">Reliability: {item.reliability}</p>
      </>
    );
  }

  if (item.category === "ammo") {
    return (
      <>
        <p className="text-sm text-zinc-400">Ammo Type: {item.ammoType}</p>
        <p className="text-sm text-zinc-400">Damage: {item.damage}</p>
        <p className="text-sm text-zinc-400">
          Armor Damage: {item.armorDamage}
        </p>
        <p className="text-sm text-zinc-400">
          Accuracy Modifier: {item.accuracyModifier}
        </p>
      </>
    );
  }

  if (item.category === "armor" || item.category === "helmet") {
    return (
      <>
        <p className="text-sm text-zinc-400">Protection: {item.protection}</p>
        <p className="text-sm text-zinc-400">Durability: {item.durability}</p>
        <p className="text-sm text-zinc-400">Weight: {item.weight}</p>
      </>
    );
  }

  if (item.category === "rig") {
    return (
      <>
        <p className="text-sm text-zinc-400">Slots: {item.slots}</p>
        <p className="text-sm text-zinc-400">Weight: {item.weight}</p>
      </>
    );
  }

  if (item.category === "backpack") {
    return (
      <>
        <p className="text-sm text-zinc-400">Slots: {item.slots}</p>
        <p className="text-sm text-zinc-400">
          Carry Bonus: {item.carryWeightBonus}
        </p>
        <p className="text-sm text-zinc-400">Weight: {item.weight}</p>
      </>
    );
  }

  if (item.category === "medical") {
    return (
      <p className="text-sm text-zinc-400">
        Healing Power: {item.healingPower}
      </p>
    );
  }

  if (item.category === "attachment") {
    return (
      <>
        <p className="text-sm text-zinc-400">Slot: {item.slot}</p>
        <p className="text-sm text-zinc-400">
          Accuracy Modifier: {item.accuracyModifier}
        </p>
        {item.ammoCapacityModifier !== undefined && (
          <p className="text-sm text-zinc-400">
            Ammo Capacity Modifier: {item.ammoCapacityModifier}
          </p>
        )}
      </>
    );
  }

  return null;
}

export default function StashPage() {
  const [activeFilter, setActiveFilter] = useState<ItemCategory | "all">("all");

  const filteredItems =
    activeFilter === "all"
      ? items
      : items.filter((item) => item.category === activeFilter);

  return (
    <GamePage title="STASH">
      <div className="grid gap-5">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Button
              key={filter.value}
              active={activeFilter === filter.value}
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        <p className="text-sm text-zinc-500">
          Showing {filteredItems.length} item(s)
        </p>

        <div className="grid gap-3">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item}>
              <ItemStats item={item} />
            </ItemCard>
          ))}
        </div>
      </div>
    </GamePage>
  );
}