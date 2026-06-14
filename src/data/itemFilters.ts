import type { ItemCategory } from "@/data/items";

export const itemFilters: Array<{ label: string; value: ItemCategory | "all" }> = [
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
