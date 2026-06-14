export type EnemyArchetype = {
  id: string;
  name: string;
  description: string;
  encounterWeight: number;
  weaponPoolId: string;
  armorPoolId: string;
  helmetPoolId: string;
  backpackPoolId: string;
  lootPoolId: string;
  baseXpReward: number;
  baseAggression: number;
};

export const enemyArchetypes: EnemyArchetype[] = [
  {
    id: "scavenger",
    name: "Scavenger",
    description: "Poorly equipped opportunist searching KORVAK for scraps.",
    encounterWeight: 60,
    weaponPoolId: "scavenger_weapons",
    armorPoolId: "scavenger_armor",
    helmetPoolId: "scavenger_helmets",
    backpackPoolId: "scavenger_backpacks",
    lootPoolId: "korvak_common",
    baseXpReward: 10,
    baseAggression: 25,
  },
  {
    id: "raider",
    name: "Raider",
    description: "Aggressive hostile with better weapons and basic armor.",
    encounterWeight: 25,
    weaponPoolId: "raider_weapons",
    armorPoolId: "raider_armor",
    helmetPoolId: "raider_helmets",
    backpackPoolId: "raider_backpacks",
    lootPoolId: "korvak_common",
    baseXpReward: 25,
    baseAggression: 45,
  },
  {
    id: "mercenary",
    name: "Mercenary",
    description: "Contract fighter operating inside KORVAK.",
    encounterWeight: 10,
    weaponPoolId: "mercenary_weapons",
    armorPoolId: "mercenary_armor",
    helmetPoolId: "mercenary_helmets",
    backpackPoolId: "mercenary_backpacks",
    lootPoolId: "korvak_common",
    baseXpReward: 45,
    baseAggression: 65,
  },
  {
    id: "patrol",
    name: "Enemy Patrol",
    description: "Organized hostile patrol moving through KORVAK.",
    encounterWeight: 5,
    weaponPoolId: "patrol_weapons",
    armorPoolId: "patrol_armor",
    helmetPoolId: "patrol_helmets",
    backpackPoolId: "patrol_backpacks",
    lootPoolId: "korvak_common",
    baseXpReward: 75,
    baseAggression: 80,
  },
];

export function getEnemyArchetypeById(
  archetypeId: string
): EnemyArchetype | null {
  return enemyArchetypes.find((enemy) => enemy.id === archetypeId) ?? null;
}
