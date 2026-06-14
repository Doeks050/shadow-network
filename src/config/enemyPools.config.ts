export type WeightedPoolEntry = {
  id: string | null;
  weight: number;
};

export type EnemyEquipmentPool = {
  id: string;
  name: string;
  itemIds: WeightedPoolEntry[];
};

export const enemyWeaponPools: EnemyEquipmentPool[] = [
  {
    id: "scavenger_weapons",
    name: "Scavenger Weapons",
    itemIds: [
      { id: "glock_17", weight: 55 },
      { id: "mp5", weight: 20 },
      { id: "akm", weight: 10 },
      { id: null, weight: 15 },
    ],
  },
  {
    id: "raider_weapons",
    name: "Raider Weapons",
    itemIds: [
      { id: "glock_17", weight: 15 },
      { id: "mp5", weight: 35 },
      { id: "akm", weight: 30 },
      { id: "m4a1", weight: 20 },
    ],
  },
  {
    id: "mercenary_weapons",
    name: "Mercenary Weapons",
    itemIds: [
      { id: "mp5", weight: 20 },
      { id: "akm", weight: 35 },
      { id: "m4a1", weight: 45 },
    ],
  },
  {
    id: "patrol_weapons",
    name: "Patrol Weapons",
    itemIds: [
      { id: "akm", weight: 40 },
      { id: "m4a1", weight: 60 },
    ],
  },
];

export const enemyArmorPools: EnemyEquipmentPool[] = [
  {
    id: "scavenger_armor",
    name: "Scavenger Armor",
    itemIds: [
      { id: null, weight: 70 },
      { id: "soft_armor_vest", weight: 30 },
    ],
  },
  {
    id: "raider_armor",
    name: "Raider Armor",
    itemIds: [
      { id: null, weight: 30 },
      { id: "soft_armor_vest", weight: 70 },
    ],
  },
  {
    id: "mercenary_armor",
    name: "Mercenary Armor",
    itemIds: [{ id: "soft_armor_vest", weight: 100 }],
  },
  {
    id: "patrol_armor",
    name: "Patrol Armor",
    itemIds: [{ id: "soft_armor_vest", weight: 100 }],
  },
];

export const enemyHelmetPools: EnemyEquipmentPool[] = [
  {
    id: "scavenger_helmets",
    name: "Scavenger Helmets",
    itemIds: [
      { id: null, weight: 80 },
      { id: "basic_helmet", weight: 20 },
    ],
  },
  {
    id: "raider_helmets",
    name: "Raider Helmets",
    itemIds: [
      { id: null, weight: 45 },
      { id: "basic_helmet", weight: 55 },
    ],
  },
  {
    id: "mercenary_helmets",
    name: "Mercenary Helmets",
    itemIds: [
      { id: null, weight: 15 },
      { id: "basic_helmet", weight: 85 },
    ],
  },
  {
    id: "patrol_helmets",
    name: "Patrol Helmets",
    itemIds: [{ id: "basic_helmet", weight: 100 }],
  },
];

export const enemyBackpackPools: EnemyEquipmentPool[] = [
  {
    id: "scavenger_backpacks",
    name: "Scavenger Backpacks",
    itemIds: [
      { id: null, weight: 70 },
      { id: "small_backpack", weight: 30 },
    ],
  },
  {
    id: "raider_backpacks",
    name: "Raider Backpacks",
    itemIds: [
      { id: null, weight: 30 },
      { id: "small_backpack", weight: 70 },
    ],
  },
  {
    id: "mercenary_backpacks",
    name: "Mercenary Backpacks",
    itemIds: [
      { id: null, weight: 10 },
      { id: "small_backpack", weight: 90 },
    ],
  },
  {
    id: "patrol_backpacks",
    name: "Patrol Backpacks",
    itemIds: [{ id: "small_backpack", weight: 100 }],
  },
];

function getPoolById(
  pools: EnemyEquipmentPool[],
  poolId: string
): EnemyEquipmentPool | null {
  return pools.find((pool) => pool.id === poolId) ?? null;
}

export function getEnemyWeaponPoolById(
  poolId: string
): EnemyEquipmentPool | null {
  return getPoolById(enemyWeaponPools, poolId);
}

export function getEnemyArmorPoolById(
  poolId: string
): EnemyEquipmentPool | null {
  return getPoolById(enemyArmorPools, poolId);
}

export function getEnemyHelmetPoolById(
  poolId: string
): EnemyEquipmentPool | null {
  return getPoolById(enemyHelmetPools, poolId);
}

export function getEnemyBackpackPoolById(
  poolId: string
): EnemyEquipmentPool | null {
  return getPoolById(enemyBackpackPools, poolId);
}
