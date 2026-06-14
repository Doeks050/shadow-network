import { items } from "@/data/items";
import type { GameItem } from "@/data/items";

export function getItemById(itemId: string | null): GameItem | null {
  if (!itemId) {
    return null;
  }

  return items.find((item) => item.id === itemId) ?? null;
}

export function getItemName(itemId: string | null): string {
  const item = getItemById(itemId);

  if (!item) {
    return "None";
  }

  return item.name;
}
