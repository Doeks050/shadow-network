export type EnemyEncounterPoolEntry = {
  archetypeId: string;
  weight: number;
};

export type EnemyEncounterPool = {
  id: string;
  name: string;
  enemies: EnemyEncounterPoolEntry[];
};

export const enemyEncounterPools: EnemyEncounterPool[] = [
  {
    id: "korvak_enemies",
    name: "KORVAK Enemy Encounters",
    enemies: [
      { archetypeId: "scavenger", weight: 65 },
      { archetypeId: "raider", weight: 25 },
      { archetypeId: "mercenary", weight: 8 },
      { archetypeId: "patrol", weight: 2 },
    ],
  },
];

export function getEnemyEncounterPoolById(
  poolId: string
): EnemyEncounterPool | null {
  return enemyEncounterPools.find((pool) => pool.id === poolId) ?? null;
}
