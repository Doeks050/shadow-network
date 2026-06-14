import type { GameItem } from "@/data/items";

const STASH_STORAGE_KEY = "shadow-network-stash";

export type StoredStashItem = {
  itemId: string;
  quantity: number;
};

export function getStoredStash(): StoredStashItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  const rawStash = window.localStorage.getItem(STASH_STORAGE_KEY);

  if (!rawStash) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawStash);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
}

export function saveStoredStash(stash: StoredStashItem[]) {
  window.localStorage.setItem(STASH_STORAGE_KEY, JSON.stringify(stash));
}

export function addItemsToStash(items: GameItem[]) {
  const currentStash = getStoredStash();

  for (const item of items) {
    const existingItem = currentStash.find(
      (stashItem) => stashItem.itemId === item.id
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      currentStash.push({
        itemId: item.id,
        quantity: 1,
      });
    }
  }

  saveStoredStash(currentStash);
}

export function removeOneItemFromStash(itemId: string): boolean {
  const currentStash = getStoredStash();
  const existingItem = currentStash.find(
    (stashItem) => stashItem.itemId === itemId
  );

  if (!existingItem || existingItem.quantity <= 0) {
    return false;
  }

  existingItem.quantity -= 1;

  const cleanedStash = currentStash.filter(
    (stashItem) => stashItem.quantity > 0
  );

  saveStoredStash(cleanedStash);

  return true;
}

export function clearStoredStash() {
  window.localStorage.removeItem(STASH_STORAGE_KEY);
}
