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
  { id: "weapons", label: "Weapons", categories: ["weapon"] },
  { id: "ammo", label: "Ammo", categories: ["ammo"] },
  { id: "armor", label: "Armor", categories: ["armor"] },
  { id: "helmets", label: "Helmets", categories: ["helmet"] },
  { id: "rigs", label: "Rigs", categories: ["rig"] },
  { id: "backpacks", label: "Backpacks", categories: ["backpack"] },
  { id: "medical", label: "Medical", categories: ["medical"] },
  { id: "attachments", label: "Attachments", categories: ["attachment", "magazine"] },
  {
    id: "valuables_loot",
    label: "Valuables & Loot",
    categories: ["valuable", "loot", "key_item"],
  },
];

export const marketListings: MarketListing[] = [
  { itemId: "glock_17", price: 450 },
  { itemId: "mp5", price: 900 },
  { itemId: "m4a1", price: 1450 },
  { itemId: "akm", price: 1300 },

  { itemId: "ammo_9x19_fmj", price: 12 },
  { itemId: "ammo_556_fmj", price: 18 },
  { itemId: "ammo_762_fmj", price: 22 },
  { itemId: "ammo_12g_buckshot", price: 16 },

  { itemId: "glock_17_mag_17", price: 140 },
  { itemId: "glock_17_mag_24", price: 260 },
  { itemId: "glock_17_drum_50", price: 780 },
  { itemId: "mp5_mag_30", price: 220 },
  { itemId: "mp5_drum_50", price: 860 },
  { itemId: "stanag_30_mag", price: 240 },
  { itemId: "stanag_45_mag", price: 440 },
  { itemId: "stanag_60_drum", price: 1100 },
  { itemId: "ak_30_mag", price: 220 },
  { itemId: "ak_75_drum", price: 1200 },
  { itemId: "red_dot_sight", price: 260 },
  { itemId: "holo_sight", price: 440 },
  { itemId: "compact_scope", price: 820 },

  { itemId: "standard_barrel", price: 180 },
  { itemId: "short_barrel", price: 320 },
  { itemId: "precision_barrel", price: 980 },

  { itemId: "flashlight", price: 220 },
  { itemId: "laser_sight", price: 480 },
  { itemId: "ir_laser", price: 820 },

  { itemId: "vertical_grip", price: 420 },
  { itemId: "angled_grip", price: 460 },

  { itemId: "light_stock", price: 280 },
  { itemId: "stability_stock", price: 520 },
  { itemId: "flash_hider", price: 260 },
  { itemId: "compensator", price: 560 },
  { itemId: "suppressor", price: 1200 },
  { itemId: "light_handstop", price: 320 },
  { itemId: "tactical_stock", price: 820 },


  { itemId: "bandage", price: 75 },
  { itemId: "painkillers", price: 120 },
  { itemId: "field_dressing", price: 160 },
  { itemId: "splint", price: 150 },
  { itemId: "compact_medkit", price: 320 },
  { itemId: "trauma_kit", price: 700 },

  { itemId: "soft_armor_vest", price: 650 },
  { itemId: "padded_security_vest", price: 900 },
  { itemId: "plate_carrier", price: 1500 },
  { itemId: "reinforced_carrier", price: 2400 },

  { itemId: "basic_helmet", price: 400 },

  { itemId: "scout_rig", price: 350 },
  { itemId: "light_tactical_rig", price: 650 },
  { itemId: "assault_rig", price: 1050 },
  { itemId: "heavy_combat_rig", price: 1600 },

  { itemId: "small_backpack", price: 350 },
  { itemId: "field_backpack", price: 620 },
  { itemId: "hiking_pack", price: 980 },
  { itemId: "large_rucksack", price: 1700 },

  { itemId: "ruger_mk4", price: 340 },
  { itemId: "makarov_pm", price: 360 },
  { itemId: "tokarev_tt33", price: 420 },
  { itemId: "colt_m1911", price: 680 },
  { itemId: "ruger_mk4_mag_10", price: 100 },
  { itemId: "ruger_mk4_mag_20", price: 210 },
  { itemId: "makarov_mag_8", price: 90 },
  { itemId: "makarov_mag_12", price: 170 },
  { itemId: "tokarev_mag_8", price: 100 },
  { itemId: "tokarev_mag_12", price: 190 },
  { itemId: "m1911_mag_7", price: 130 },
  { itemId: "m1911_mag_8", price: 160 },
  { itemId: "m1911_mag_15", price: 340 },
  { itemId: "mini_red_dot_sight", price: 300 },
  { itemId: "compact_reflex_sight", price: 500 },
  { itemId: "pistol_red_dot_sight", price: 720 },
  { itemId: "threaded_suppressor_adapter", price: 230 },
  { itemId: "small_caliber_suppressor", price: 520 },
  { itemId: "makarov_suppressor", price: 500 },
  { itemId: "basic_pistol_suppressor", price: 440 },
  { itemId: "muzzle_brake", price: 360 },
  { itemId: "glock_suppressor", price: 680 },
  { itemId: "glock_compensator", price: 640 },
  { itemId: "glock_ported_compensator", price: 960 },
  { itemId: "pistol_9mm_suppressor", price: 1020 },
  { itemId: "m1911_suppressor", price: 700 },
  { itemId: "m1911_compensator", price: 660 },
  { itemId: "pistol_45_suppressor", price: 1100 },
  { itemId: "compact_flashlight", price: 220 },
  { itemId: "compact_laser", price: 320 },
  { itemId: "tactical_flashlight", price: 380 },
  { itemId: "tactical_laser", price: 600 },
];

export function getMarketListingByItemId(itemId: string): MarketListing | null {
  return marketListings.find((listing) => listing.itemId === itemId) ?? null;
}
