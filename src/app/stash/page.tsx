"use client";

import { useEffect, useState } from "react";
import GamePage from "@/components/GamePage";
import StashBrowser from "@/components/items/StashBrowser";
import type { StashBrowserItem } from "@/components/items/StashBrowser";
import ActionButton from "@/components/ui/ActionButton";
import SectionTitle from "@/components/ui/SectionTitle";
import { getItemById } from "@/lib/items";
import {
  clearStoredStash,
  getStoredStash,
  type StoredStashItem,
} from "@/lib/playerStash";

function mapStoredStash(stash: StoredStashItem[]): StashBrowserItem[] {
  return stash
    .map((stashItem) => {
      const item = getItemById(stashItem.itemId);

      if (!item) {
        return null;
      }

      return {
        item,
        quantity: stashItem.quantity,
      };
    })
    .filter((stashItem): stashItem is StashBrowserItem => stashItem !== null);
}

export default function StashPage() {
  const [stashItems, setStashItems] = useState<StashBrowserItem[]>([]);

  function refreshStash() {
    const storedStash = getStoredStash();
    const mappedItems = mapStoredStash(storedStash);

    setStashItems(mappedItems);
  }

  function handleClearStash() {
    clearStoredStash();
    refreshStash();
  }

  useEffect(() => {
    refreshStash();
  }, []);

  return (
    <GamePage title="STASH">
      <div className="grid gap-5">
        <section>
          <SectionTitle>PLAYER STASH</SectionTitle>
          <p className="text-sm text-zinc-400">
            Items recovered from successful raids.
          </p>
        </section>

        <div>
          <ActionButton onClick={handleClearStash}>Clear Stash</ActionButton>
        </div>

        {stashItems.length > 0 ? (
          <StashBrowser items={stashItems} />
        ) : (
          <p className="text-sm text-zinc-500">
            Your stash is empty. Complete a successful raid to recover loot.
          </p>
        )}
      </div>
    </GamePage>
  );
}
