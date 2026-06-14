"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import ItemCard from "@/components/ui/ItemCard";
import ItemStats from "@/components/ui/ItemStats";
import { itemFilters } from "@/data/itemFilters";
import type { GameItem, ItemCategory } from "@/data/items";

export type StashBrowserItem = {
  item: GameItem;
  quantity: number;
};

type StashBrowserProps = {
  items: StashBrowserItem[];
};

export default function StashBrowser({ items }: StashBrowserProps) {
  const [activeFilter, setActiveFilter] = useState<ItemCategory | "all">("all");

  const filteredItems =
    activeFilter === "all"
      ? items
      : items.filter((stashItem) => stashItem.item.category === activeFilter);

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap gap-2">
        {itemFilters.map((filter) => (
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
        Showing {filteredItems.length} item type(s)
      </p>

      <div className="grid gap-3">
        {filteredItems.map((stashItem) => (
          <ItemCard key={stashItem.item.id} item={stashItem.item}>
            <p className="mb-2 text-sm font-semibold text-zinc-300">
              Quantity: x{stashItem.quantity}
            </p>
            <ItemStats item={stashItem.item} />
          </ItemCard>
        ))}
      </div>
    </div>
  );
}
