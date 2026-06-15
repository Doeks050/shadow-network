import type { MedicalItem } from "./types";

export const medical: MedicalItem[] = [
  {
    id: "bandage",
    name: "Bandage",
    category: "medical",
    rarity: "common",
    value: 25,
    healingPower: 10,
  },
  {
    id: "painkillers",
    name: "Painkillers",
    category: "medical",
    rarity: "common",
    value: 60,
    healingPower: 5,
  },
  {
    id: "field_dressing",
    name: "Field Dressing",
    category: "medical",
    rarity: "common",
    value: 85,
    healingPower: 20,
  },
  {
    id: "splint",
    name: "Splint",
    category: "medical",
    rarity: "common",
    value: 90,
    healingPower: 0,
  },
  {
    id: "compact_medkit",
    name: "Compact Medkit",
    category: "medical",
    rarity: "uncommon",
    value: 180,
    healingPower: 45,
  },
  {
    id: "trauma_kit",
    name: "Trauma Kit",
    category: "medical",
    rarity: "rare",
    value: 420,
    healingPower: 80,
  },
];
