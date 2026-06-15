import type { PlayerLoadout } from "@/data/loadout";
import { getItemById } from "@/lib/items";
import { calculateLoadoutStats, getContainerLabel } from "@/lib/loadout";

type LoadoutSummaryProps = {
  loadout: PlayerLoadout;
};

function getItemName(itemId: string): string {
  if (!itemId) {
    return "Empty";
  }

  return getItemById(itemId)?.name ?? itemId;
}

export default function LoadoutSummary({ loadout }: LoadoutSummaryProps) {
  const stats = calculateLoadoutStats(loadout);

  return (
    <div className="grid gap-3 rounded border border-zinc-800 bg-zinc-950 p-4 text-sm">
      <div className="grid gap-1">
        <p>
          <span className="text-zinc-500">Primary:</span>{" "}
          {getItemName(loadout.primaryWeaponId)}
        </p>

        <p>
          <span className="text-zinc-500">Secondary:</span>{" "}
          {getItemName(loadout.secondaryWeaponId)}
        </p>

        <p>
          <span className="text-zinc-500">Headgear:</span>{" "}
          {getItemName(loadout.headgearId)}
        </p>

        <p>
          <span className="text-zinc-500">Chest:</span>{" "}
          {getItemName(loadout.armorId)} · {getItemName(loadout.rigId)}
        </p>
      </div>

      <div className="grid gap-1 border-t border-zinc-800 pt-3">
        <p>
          <span className="text-zinc-500">Combat:</span> {stats.combatScore}
        </p>

        <p>
          <span className="text-zinc-500">Protection:</span>{" "}
          {stats.protectionScore}
        </p>

        {Object.entries(stats.carrySlots).map(([container, summary]) => (
          <p key={container}>
            <span className="text-zinc-500">
              {getContainerLabel(container as keyof typeof stats.carrySlots)}:
            </span>{" "}
            {summary.used}/{summary.total}
          </p>
        ))}
      </div>
    </div>
  );
}
