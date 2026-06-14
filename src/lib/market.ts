import {
  getMarketListingByItemId,
  marketListings,
  marketPricingConfig,
} from "@/config/market.config";
import type { GameItem } from "@/data/items";
import { getItemById } from "@/lib/items";
import type { StoredStashItem } from "@/lib/playerStash";

export type MarketDisplayListing = {
  item: GameItem;
  price: number;
};

export type SellDisplayListing = {
  item: GameItem;
  quantity: number;
  sellPrice: number;
};

export function getMarketDisplayListings(): MarketDisplayListing[] {
  return marketListings
    .map((listing) => {
      const item = getItemById(listing.itemId);

      if (!item) {
        return null;
      }

      return {
        item,
        price: listing.price,
      };
    })
    .filter((listing): listing is MarketDisplayListing => listing !== null);
}

export function getBuyPriceForItem(itemId: string): number | null {
  const listing = getMarketListingByItemId(itemId);

  return listing?.price ?? null;
}

export function getSellPriceForItem(item: GameItem): number {
  const buyPrice = getBuyPriceForItem(item.id);

  if (buyPrice !== null) {
    return Math.max(
      1,
      Math.floor(buyPrice * marketPricingConfig.knownItemSellMultiplier)
    );
  }

  if (typeof item.value === "number") {
    return Math.max(
      1,
      Math.floor(item.value * marketPricingConfig.itemValueSellMultiplier)
    );
  }

  return marketPricingConfig.fallbackSellPrice;
}

export function getSellListings(stash: StoredStashItem[]): SellDisplayListing[] {
  return stash
    .map((stashItem) => {
      const item = getItemById(stashItem.itemId);

      if (!item) {
        return null;
      }

      return {
        item,
        quantity: stashItem.quantity,
        sellPrice: getSellPriceForItem(item),
      };
    })
    .filter((listing): listing is SellDisplayListing => listing !== null);
}
