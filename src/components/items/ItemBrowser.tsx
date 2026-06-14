"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import ItemCard from "@/components/ui/ItemCard";
import ItemStats from "@/components/ui/ItemStats";
import { itemFilters } from "@/data/itemFilters";
import type { GameItem, ItemCategory } from "@/data/items";

type ItemBrowserProps = {
  items: GameItem[];
  renderActions?: (item: GameItem) => React.ReactNode;
};

export default function ItemBrowser({ items, renderActions }: ItemBrowserProps) {
  const [activeFilter, setActiveFilter] = useState<ItemCategory | "all">("all");

  const filteredItems =
    activeFilter === "all"
      ? items
      : items.filter((item) => item.category === activeFilter);

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
        Showing {filteredItems.length} item(s)
      </p>

      <div className="grid gap-3">
        {filteredItems.map((item) => (
          <ItemCard key={item.id} item={item}>
            <ItemStats item={item} />
            {renderActions && <div className="mt-3">{renderActions(item)}</div>}
          </ItemCard>
        ))}
      </div>
    </div>
  );
}
