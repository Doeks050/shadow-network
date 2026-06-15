import { ammo } from "./ammo";
import { armor } from "./armor";
import { attachments } from "./attachments";
import { backpacks } from "./backpacks";
import { helmets } from "./helmets";
import { keyItems } from "./keyItems";
import { loot } from "./loot";
import { magazines } from "./magazines";
import { medical } from "./medical";
import { rigs } from "./rigs";
import type { GameItem } from "./types";
import { valuables } from "./valuables";
import { weapons } from "./weapons";

export const items: GameItem[] = [
  ...weapons,
  ...ammo,
  ...magazines,
  ...armor,
  ...helmets,
  ...rigs,
  ...backpacks,
  ...medical,
  ...attachments,
  ...valuables,
  ...keyItems,
  ...loot,
];

export * from "./ammo";
export * from "./armor";
export * from "./attachments";
export * from "./backpacks";
export * from "./helmets";
export * from "./keyItems";
export * from "./loot";
export * from "./magazines";
export * from "./medical";
export * from "./rigs";
export * from "./types";
export * from "./valuables";
export * from "./weapons";
