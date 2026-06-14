export type EnemyType =
  | "scavenger"
  | "armed_scavenger"
  | "raider"
  | "mercenary"
  | "patrol"
  | "squad"
  | "boss";

export type EnemyTemplate = {
  id: string;
  name: string;
  type: EnemyType;
  combatRating: number;
  encounterWeight: number;
  minDamage: number;
  maxDamage: number;
  minAmmoUsed: number;
  maxAmmoUsed: number;
  xpReward: number;
};

export const enemies: EnemyTemplate[] = [
  {
    id: "scavenger",
    name: "Scavenger",
    type: "scavenger",
    combatRating: 20,
    encounterWeight: 40,
    minDamage: 0,
    maxDamage: 12,
    minAmmoUsed: 2,
    maxAmmoUsed: 6,
    xpReward: 10,
  },
  {
    id: "armed_scavenger",
    name: "Armed Scavenger",
    type: "armed_scavenger",
    combatRating: 35,
    encounterWeight: 25,
    minDamage: 5,
    maxDamage: 20,
    minAmmoUsed: 5,
    maxAmmoUsed: 12,
    xpReward: 18,
  },
  {
    id: "raider",
    name: "Raider",
    type: "raider",
    combatRating: 55,
    encounterWeight: 15,
    minDamage: 10,
    maxDamage: 35,
    minAmmoUsed: 10,
    maxAmmoUsed: 25,
    xpReward: 30,
  },
  {
    id: "mercenary",
    name: "Mercenary",
    type: "mercenary",
    combatRating: 75,
    encounterWeight: 8,
    minDamage: 15,
    maxDamage: 45,
    minAmmoUsed: 15,
    maxAmmoUsed: 35,
    xpReward: 45,
  },
  {
    id: "patrol",
    name: "Enemy Patrol",
    type: "patrol",
    combatRating: 120,
    encounterWeight: 3,
    minDamage: 20,
    maxDamage: 65,
    minAmmoUsed: 25,
    maxAmmoUsed: 60,
    xpReward: 75,
  },
];

export function getEnemyById(enemyId: string): EnemyTemplate | null {
  return enemies.find((enemy) => enemy.id === enemyId) ?? null;
}
