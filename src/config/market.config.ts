import type { ItemCategory } from "@/data/items";

export type MarketListing = {
  itemId: string;
  price: number;
};

export type MarketPricingConfig = {
  knownItemSellMultiplier: number;
  itemValueSellMultiplier: number;
  fallbackSellPrice: number;
};

export type MarketCategorySection = {
  id: string;
  label: string;
  categories: ItemCategory[];
};

export const marketPricingConfig: MarketPricingConfig = {
  knownItemSellMultiplier: 0.5,
  itemValueSellMultiplier: 0.5,
  fallbackSellPrice: 25,
};

export const marketCategorySections: MarketCategorySection[] = [
  {
    id: "weapons",
    label: "Weapons",
    categories: ["weapon"],
  },
  {
    id: "ammo",
    label: "Ammo",
    categories: ["ammo"],
  },
  {
    id: "armor",
    label: "Armor",
    categories: ["armor"],
  },
  {
    id: "helmets",
    label: "Helmets",
    categories: ["helmet"],
  },
  {
    id: "rigs",
    label: "Rigs",
    categories: ["rig"],
  },
  {
    id: "backpacks",
    label: "Backpacks",
    categories: ["backpack"],
  },
  {
    id: "medical",
    label: "Medical",
    categories: ["medical"],
  },
  {
    id: "attachments",
    label: "Attachments",
    categories: ["attachment"],
  },
  {
    id: "valuables_loot",
    label: "Valuables & Loot",
    categories: ["valuable", "loot", "key_item"],
  },
];

export const marketListings: MarketListing[] = [
  {
    itemId: "glock_17",
    price: 450,
  },
  {
    itemId: "mp5",
    price: 900,
  },
  {
    itemId: "ammo_9x19_fmj",
    price: 12,
  },
  {
    itemId: "ammo_556_fmj",
    price: 18,
  },
  {
    itemId: "bandage",
    price: 75,
  },
  {
    itemId: "soft_armor_vest",
    price: 650,
  },
  {
    itemId: "basic_helmet",
    price: 400,
  },
  {
    itemId: "small_backpack",
    price: 350,
  },
];

export function getMarketListingByItemId(
  itemId: string
): MarketListing | null {
  return marketListings.find((listing) => listing.itemId === itemId) ?? null;
}
