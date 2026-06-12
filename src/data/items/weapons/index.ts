import { assaultRifles } from "./assaultRifles";
import { battleRifles } from "./battleRifles";
import { marksmanRifles } from "./marksmanRifles";
import { pistols } from "./pistols";
import { smgs } from "./smgs";
import { sniperRifles } from "./sniperRifles";
import type { WeaponItem } from "./types";

export const weapons: WeaponItem[] = [
  ...pistols,
  ...smgs,
  ...assaultRifles,
  ...battleRifles,
  ...marksmanRifles,
  ...sniperRifles,
];

export * from "./assaultRifles";
export * from "./battleRifles";
export * from "./marksmanRifles";
export * from "./pistols";
export * from "./smgs";
export * from "./sniperRifles";
export * from "./types";
