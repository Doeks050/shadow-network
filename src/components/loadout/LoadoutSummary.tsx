import type { PlayerLoadout } from "@/data/loadout";
import { getItemById } from "@/lib/items";

type LoadoutSummaryProps = {
  loadout: PlayerLoadout;
};

function getItemName(itemId: string): string {
  return getItemById(itemId)?.name ?? "Empty";
}

function getCarriedItemsText(loadout: PlayerLoadout): string {
  if (loadout.carriedItems.length === 0) {
    return "None";
  }

  return loadout.carriedItems
    .map((entry) => {
      const item = getItemById(entry.itemId);
      return `${item?.name ?? entry.itemId} x${entry.quantity}`;
    })
    .join(", ");
}

export default function LoadoutSummary({ loadout }: LoadoutSummaryProps) {
  return (
    <div className="grid gap-1 text-sm text-zinc-300">
      <p>
        <span className="text-zinc-500">Primary:</span>{" "}
        {getItemName(loadout.primaryWeaponId)}
      </p>

      <p>
        <span className="text-zinc-500">Sidearm:</span>{" "}
        {getItemName(loadout.sidearmId)}
      </p>

      <p>
        <span className="text-zinc-500">Armor:</span>{" "}
        {getItemName(loadout.armorId)}
      </p>

      <p>
        <span className="text-zinc-500">Helmet:</span>{" "}
        {getItemName(loadout.helmetId)}
      </p>

      <p>
        <span className="text-zinc-500">Rig:</span>{" "}
        {getItemName(loadout.rigId)}
      </p>

      <p>
        <span className="text-zinc-500">Backpack:</span>{" "}
        {getItemName(loadout.backpackId)}
      </p>

      <p>
        <span className="text-zinc-500">Carried:</span>{" "}
        {getCarriedItemsText(loadout)}
      </p>
    </div>
  );
}
