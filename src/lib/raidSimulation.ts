import {
  enemyArchetypes,
  getEnemyArchetypeById,
  type EnemyArchetype,
} from "@/config/enemyArchetypes.config";
import { getEnemyEncounterPoolById } from "@/config/enemyEncounterPools.config";
import type { GameItem } from "@/data/items";
import type { PlayerLoadout } from "@/data/loadout";
import type { RaidMap } from "@/data/maps";
import { generateEnemy, type GeneratedEnemy } from "@/lib/enemies";
import { calculateLoadoutStats } from "@/lib/loadout";

export type RaidEnemyEncounter = {
  enemyName: string;
  weaponName: string;
  armorName: string;
  helmetName: string;
  backpackName: string;
  combatRating: number;
  lootCapacity: number;
};

export type RaidResult = {
  success: boolean;
  mapName: string;
  xpEarned: number;
  cashFound: number;
  damageTaken: number;
  ammoUsed: number;
  carryCapacity: number;
  lootFound: GameItem[];
  lootLeftBehind: GameItem[];
  enemyEncounter: RaidEnemyEncounter | null;
  log: string[];
};

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rollChance(percent: number): boolean {
  return Math.random() * 100 <= percent;
}

function pickWeightedEnemyArchetype(map: RaidMap): EnemyArchetype {
  const encounterPool = getEnemyEncounterPoolById(map.enemyEncounterPoolId);

  if (!encounterPool || encounterPool.enemies.length === 0) {
    return enemyArchetypes[0];
  }

  const totalWeight = encounterPool.enemies.reduce(
    (sum, entry) => sum + entry.weight,
    0
  );

  let roll = Math.random() * totalWeight;

  for (const entry of encounterPool.enemies) {
    roll -= entry.weight;

    if (roll <= 0) {
      return getEnemyArchetypeById(entry.archetypeId) ?? enemyArchetypes[0];
    }
  }

  const fallbackEntry = encounterPool.enemies[encounterPool.enemies.length - 1];

  return getEnemyArchetypeById(fallbackEntry.archetypeId) ?? enemyArchetypes[0];
}

function toRaidEnemyEncounter(enemy: GeneratedEnemy): RaidEnemyEncounter {
  return {
    enemyName: enemy.name,
    weaponName: enemy.weapon?.name ?? "None",
    armorName: enemy.armor?.name ?? "None",
    helmetName: enemy.helmet?.name ?? "None",
    backpackName: enemy.backpack?.name ?? "None",
    combatRating: enemy.combatRating,
    lootCapacity: enemy.lootCapacity,
  };
}

function getLootFromEnemy(enemy: GeneratedEnemy): GameItem[] {
  const loot: GameItem[] = [...enemy.carriedLoot];

  if (enemy.weapon && rollChance(70)) {
    loot.push(enemy.weapon);
  }

  if (enemy.armor && rollChance(45)) {
    loot.push(enemy.armor);
  }

  if (enemy.helmet && rollChance(45)) {
    loot.push(enemy.helmet);
  }

  if (enemy.backpack && rollChance(60)) {
    loot.push(enemy.backpack);
  }

  return loot;
}

function applyPlayerCarryLimit(loot: GameItem[], carryCapacity: number) {
  const safeCapacity = Math.max(0, carryCapacity);

  return {
    lootFound: loot.slice(0, safeCapacity),
    lootLeftBehind: loot.slice(safeCapacity),
  };
}

export function simulateRaid(map: RaidMap, loadout: PlayerLoadout): RaidResult {
  const stats = calculateLoadoutStats(loadout);

  const enemyArchetype = pickWeightedEnemyArchetype(map);
  const generatedEnemy = generateEnemy(enemyArchetype);
  const enemyEncounter = toRaidEnemyEncounter(generatedEnemy);

  const combatDifference = stats.combatScore - generatedEnemy.combatRating;

  const successChance = Math.min(
    92,
    Math.max(
      18,
      55 + combatDifference * 0.35 + stats.protectionScore * 0.08
    )
  );

  const success = Math.random() * 100 <= successChance;

  const damageTaken = success
    ? randomBetween(
        0,
        Math.max(
          5,
          35 + generatedEnemy.combatRating * 0.2 - stats.protectionScore
        )
      )
    : randomBetween(35, 100);

  const ammoUsed = randomBetween(
    Math.max(3, Math.round(generatedEnemy.combatRating * 0.08)),
    Math.max(8, Math.round(generatedEnemy.combatRating * 0.25))
  );

  const xpEarned = success
    ? randomBetween(35, 90) + generatedEnemy.xpReward
    : randomBetween(10, 35);

  const cashFound = success ? randomBetween(50, 400) : randomBetween(0, 50);

  const rawLoot = success ? getLootFromEnemy(generatedEnemy) : [];
  const raidCarryCapacity = Object.values(stats.carrySlots).reduce(
    (total, summary) => total + Math.max(0, summary.total - summary.used),
    0
  );

  const { lootFound, lootLeftBehind } = applyPlayerCarryLimit(
    rawLoot,
    raidCarryCapacity
  );

  const log = success
    ? [
        "Deployed into the raid zone.",
        "Moved through the outer sector.",
        `${generatedEnemy.name} encountered.`,
        `Enemy weapon identified: ${enemyEncounter.weaponName}.`,
        `Enemy backpack: ${enemyEncounter.backpackName}.`,
        "Hostile contact engaged.",
        "Threat eliminated.",
        "Enemy loot secured.",
        lootLeftBehind.length > 0
          ? "Some loot was left behind due to limited carry capacity."
          : "All available loot recovered.",
        "Moved to extraction point.",
        "Extraction successful.",
      ]
    : [
        "Deployed into the raid zone.",
        "Moved through the outer sector.",
        `${generatedEnemy.name} encountered.`,
        `Enemy weapon identified: ${enemyEncounter.weaponName}.`,
        `Enemy backpack: ${enemyEncounter.backpackName}.`,
        "Hostile contact engaged.",
        "Heavy injuries sustained.",
        "Extraction route compromised.",
        "Raid failed.",
      ];

  return {
    success,
    mapName: map.name,
    xpEarned,
    cashFound,
    damageTaken,
    ammoUsed,
    carryCapacity: raidCarryCapacity,
    lootFound,
    lootLeftBehind,
    enemyEncounter,
    log,
  };
}
