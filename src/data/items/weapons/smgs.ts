import type { WeaponItem } from "./types";

export const smgs: WeaponItem[] = [
  {
    id: "mp5",
    name: "MP5",
    category: "weapon",
    rarity: "uncommon",
    value: 1200,
    weaponType: "smg",
    ammoType: "9x19",
    weaponFamily: "mp5_9mm",
    compatibleMagazineFamilies: ["mp5_9mm"],
    attachmentFamilies: {
      optic: ["small_weapon_optic", "pistol_optic"],
      barrel: ["mp5_barrel"],
      muzzle: ["mp5_muzzle", "pistol_9mm_muzzle"],
      underbarrel: ["smg_underbarrel"],
      tactical: ["pistol_tactical", "rifle_tactical"],
      stock: ["mp5_stock"],
    },
    accuracy: 68,
    handling: 72,
    recoilControl: 62,
    reloadSpeed: 65,
    fireRate: 800,
    range: "short",
    reliability: 88,
  },
];
