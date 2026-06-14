export type LootPool = {
  id: string;
  name: string;
  itemIds: string[];
};

export const lootPools: LootPool[] = [
  {
    id: "korvak_common",
    name: "KORVAK Common Loot",
    itemIds: [
      "scrap_metal",
      "electronics",
      "bandage",
      "gold_watch",
      "worn_keycard",
    ],
  },
];

export function getLootPoolById(poolId: string): LootPool | null {
  return lootPools.find((pool) => pool.id === poolId) ?? null;
}
