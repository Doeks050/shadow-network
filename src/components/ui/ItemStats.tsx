import type { GameItem } from "@/data/items";

type ItemStatsProps = {
  item: GameItem;
};

export default function ItemStats({ item }: ItemStatsProps) {
  if (item.category === "weapon") {
    return (
      <>
        <p className="text-sm text-zinc-400">Type: {item.weaponType}</p>
        <p className="text-sm text-zinc-400">Ammo: {item.ammoType}</p>
        <p className="text-sm text-zinc-400">Accuracy: {item.accuracy}</p>
        <p className="text-sm text-zinc-400">Range: {item.range}</p>
        <p className="text-sm text-zinc-400">Reliability: {item.reliability}</p>
      </>
    );
  }

  if (item.category === "ammo") {
    return (
      <>
        <p className="text-sm text-zinc-400">Ammo Type: {item.ammoType}</p>
        <p className="text-sm text-zinc-400">Damage: {item.damage}</p>
        <p className="text-sm text-zinc-400">
          Armor Damage: {item.armorDamage}
        </p>
        <p className="text-sm text-zinc-400">
          Accuracy Modifier: {item.accuracyModifier}
        </p>
      </>
    );
  }

  if (item.category === "armor" || item.category === "helmet") {
    return (
      <>
        <p className="text-sm text-zinc-400">Protection: {item.protection}</p>
        <p className="text-sm text-zinc-400">Durability: {item.durability}</p>
        <p className="text-sm text-zinc-400">Weight: {item.weight}</p>
      </>
    );
  }

  if (item.category === "rig") {
    return (
      <>
        <p className="text-sm text-zinc-400">Slots: {item.slots}</p>
        <p className="text-sm text-zinc-400">Weight: {item.weight}</p>
      </>
    );
  }

  if (item.category === "backpack") {
    return (
      <>
        <p className="text-sm text-zinc-400">Slots: {item.slots}</p>
        <p className="text-sm text-zinc-400">
          Carry Bonus: {item.carryWeightBonus}
        </p>
        <p className="text-sm text-zinc-400">Weight: {item.weight}</p>
      </>
    );
  }

  if (item.category === "medical") {
    return (
      <p className="text-sm text-zinc-400">
        Healing Power: {item.healingPower}
      </p>
    );
  }

  if (item.category === "attachment") {
    return (
      <>
        <p className="text-sm text-zinc-400">Slot: {item.slot}</p>
        <p className="text-sm text-zinc-400">
          Accuracy Modifier: {item.accuracyModifier}
        </p>
        {item.reloadSpeedModifier !== undefined && (
          <p className="text-sm text-zinc-400">
            Ammo Capacity Modifier: {item.reloadSpeedModifier}
          </p>
        )}
      </>
    );
  }

  return null;
}
