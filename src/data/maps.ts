export type RaidMap = {
  id: string;
  name: string;
  durationMinutes: number;
  extractWindowStartMinutes: number;
  extractWindowEndMinutes: number;
  requiredLevel: number;
  lootPoolId: string;
  enemyEncounterPoolId: string;
};

export const raidMaps: RaidMap[] = [
  {
    id: "korvak",
    name: "KORVAK",
    durationMinutes: 30,
    extractWindowStartMinutes: 20,
    extractWindowEndMinutes: 30,
    requiredLevel: 1,
    lootPoolId: "korvak_common",
    enemyEncounterPoolId: "korvak_enemies",
  },
];
