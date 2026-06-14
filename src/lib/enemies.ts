import type { EnemyArchetype } from "@/config/enemyArchetypes.config";
import { getLootPoolById } from "@/config/lootPools.config";
import {
  getEnemyArmorPoolById,
  getEnemyBackpackPoolById,
  getEnemyHelmetPoolById,
  getEnemyWeaponPoolById,
  type EnemyEquipmentPool,
  type WeightedPoolEntry,
} from "@/config/enemyPools.config";
import type { GameItem } from "@/data/items";
import { getItemById } from "@/lib/items";

export type GeneratedEnemy = {
  archetypeId: string;
  name: string;
  weapon: GameItem | null;
  armor: GameItem | null;
  helmet: GameItem | null;
  backpack: GameItem | null;
  carriedLoot: GameItem[];
  combatRating: number;
  lootCapacity: number;
  xpReward: number;
};

function pickWeightedEntry(entries: WeightedPoolEntry[]): WeightedPoolEntry {
  const totalWeight = entries.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const entry of entries) {
    roll -= entry.weight;

    if (roll <= 0) {
      return entry;
    }
  }

  return entries[entries.length - 1];
}

function pickItemFromPool(pool: EnemyEquipmentPool | null): GameItem | null {
  if (!pool || pool.itemIds.length === 0) {
    return null;
  }

  const selectedEntry = pickWeightedEntry(pool.itemIds);

  if (!selectedEntry.id) {
    return null;
  }

  return getItemById(selectedEntry.id);
}

function pickEnemyLoot(archetype: EnemyArchetype, lootCapacity: number): GameItem[] {
  const lootPool = getLootPoolById(archetype.lootPoolId);

  if (!lootPool || lootCapacity <= 0) {
    return [];
  }

  const maxLootAmount = Math.max(1, Math.min(lootCapacity, 4));
  const amount = Math.floor(Math.random() * maxLootAmount) + 1;
  const shuffledItemIds = [...lootPool.itemIds].sort(() => Math.random() - 0.5);

  return shuffledItemIds
    .slice(0, amount)
    .map((itemId) => getItemById(itemId))
    .filter((item): item is GameItem => item !== null);
}

function calculateEnemyCombatRating({
  archetype,
  weapon,
  armor,
  helmet,
}: {
  archetype: EnemyArchetype;
  weapon: GameItem | null;
  armor: GameItem | null;
  helmet: GameItem | null;
}): number {
  const weaponScore =
    weapon?.category === "weapon"
      ? weapon.accuracy + weapon.reliability * 0.25
      : 5;

  const armorScore =
    armor?.category === "armor" ? armor.protection + armor.durability * 0.05 : 0;

  const helmetScore =
    helmet?.category === "helmet"
      ? helmet.protection + helmet.durability * 0.025
      : 0;

  return Math.round(
    archetype.baseAggression + weaponScore + armorScore + helmetScore
  );
}

function calculateLootCapacity(backpack: GameItem | null): number {
  if (backpack?.category !== "backpack") {
    return 1;
  }

  return backpack.slots;
}

export function generateEnemy(archetype: EnemyArchetype): GeneratedEnemy {
  const weaponPool = getEnemyWeaponPoolById(archetype.weaponPoolId);
  const armorPool = getEnemyArmorPoolById(archetype.armorPoolId);
  const helmetPool = getEnemyHelmetPoolById(archetype.helmetPoolId);
  const backpackPool = getEnemyBackpackPoolById(archetype.backpackPoolId);

  const weapon = pickItemFromPool(weaponPool);
  const armor = pickItemFromPool(armorPool);
  const helmet = pickItemFromPool(helmetPool);
  const backpack = pickItemFromPool(backpackPool);

  const combatRating = calculateEnemyCombatRating({
    archetype,
    weapon,
    armor,
    helmet,
  });

  const lootCapacity = calculateLootCapacity(backpack);
  const carriedLoot = pickEnemyLoot(archetype, lootCapacity);

  return {
    archetypeId: archetype.id,
    name: archetype.name,
    weapon,
    armor,
    helmet,
    backpack,
    carriedLoot,
    combatRating,
    lootCapacity,
    xpReward: archetype.baseXpReward + Math.round(combatRating * 0.25),
  };
}
