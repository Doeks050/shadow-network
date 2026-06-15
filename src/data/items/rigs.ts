import type { RigItem } from "./types";

export const rigs: RigItem[] = [
  {
    id: "scout_rig",
    name: "Scout Rig",
    category: "rig",
    rarity: "common",
    value: 250,
    slots: 4,
    weight: 1,
  },
  {
    id: "light_tactical_rig",
    name: "Light Tactical Rig",
    category: "rig",
    rarity: "common",
    value: 420,
    slots: 6,
    weight: 2,
  },
  {
    id: "assault_rig",
    name: "Assault Rig",
    category: "rig",
    rarity: "uncommon",
    value: 750,
    slots: 8,
    weight: 3,
  },
  {
    id: "heavy_combat_rig",
    name: "Heavy Combat Rig",
    category: "rig",
    rarity: "rare",
    value: 1250,
    slots: 10,
    weight: 5,
  },
];
