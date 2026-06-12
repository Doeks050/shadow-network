"use client";

import { useState } from "react";
import GamePage from "@/components/GamePage";
import ActionButton from "@/components/ui/ActionButton";
import Button from "@/components/ui/Button";
import ItemCard from "@/components/ui/ItemCard";
import SectionTitle from "@/components/ui/SectionTitle";
import { items } from "@/data/items";
import type { ItemCategory } from "@/data/items";

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

export default function MarketPage() {
  const [activeFilter, setActiveFilter] = useState<ItemCategory | "all">("all");

  const filteredItems =
    activeFilter === "all"
      ? items
      : items.filter((item) => item.category === activeFilter);

  return (
    <GamePage title="MARKET">
      <div className="grid gap-5">
        <section>
          <SectionTitle>TRADER MARKET</SectionTitle>
          <p className="text-sm text-zinc-400">
            Buy and sell weapons, ammo, gear, medical supplies and loot.
          </p>
        </section>

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

        <section className="grid gap-3">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item}>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <ActionButton>Buy</ActionButton>
                <ActionButton>Sell</ActionButton>
              </div>
            </ItemCard>
          ))}
        </section>
      </div>
    </GamePage>
  );
}