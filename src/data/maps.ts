export type RaidMap = {
  id: string;
  name: string;
  durationMinutes: number;
  extractWindowStartMinutes: number;
  extractWindowEndMinutes: number;
  requiredLevel: number;
};

export const raidMaps: RaidMap[] = [
  {
    id: "korvak",
    name: "Korvak",
    durationMinutes: 30,
    extractWindowStartMinutes: 20,
    extractWindowEndMinutes: 30,
    requiredLevel: 1,
  },
];
