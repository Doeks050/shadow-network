import Panel from "@/components/ui/Panel";
import SectionTitle from "@/components/ui/SectionTitle";
import type { RaidResult } from "@/lib/raidSimulation";

type RaidResultCardProps = {
  result: RaidResult;
};

export default function RaidResultCard({ result }: RaidResultCardProps) {
  return (
    <Panel className="bg-zinc-950">
      <div className="grid gap-5">
        <section>
          <SectionTitle>RAID RESULT</SectionTitle>
          <p
            className={`font-bold ${
              result.success ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {result.success ? "EXTRACTION SUCCESSFUL" : "RAID FAILED"}
          </p>
          <p className="text-sm text-zinc-400">Map: {result.mapName}</p>
        </section>

        {result.enemyEncounter && (
          <section>
            <p className="mb-2 text-sm font-semibold tracking-wider">
              ENEMY ENCOUNTER
            </p>

            <div className="grid gap-1 text-sm text-zinc-400">
              <p>Enemy: {result.enemyEncounter.enemyName}</p>
              <p>Weapon: {result.enemyEncounter.weaponName}</p>
              <p>Armor: {result.enemyEncounter.armorName}</p>
              <p>Helmet: {result.enemyEncounter.helmetName}</p>
              <p>Backpack: {result.enemyEncounter.backpackName}</p>
              <p>Combat Rating: {result.enemyEncounter.combatRating}</p>
              <p>Enemy Loot Capacity: {result.enemyEncounter.lootCapacity}</p>
            </div>
          </section>
        )}

        <section className="grid gap-2 text-sm">
          <p>
            <span className="text-zinc-500">XP Earned:</span>{" "}
            {result.xpEarned}
          </p>
          <p>
            <span className="text-zinc-500">Cash Found:</span> $
            {result.cashFound.toLocaleString()}
          </p>
          <p>
            <span className="text-zinc-500">Damage Taken:</span>{" "}
            {result.damageTaken}
          </p>
          <p>
            <span className="text-zinc-500">Ammo Used:</span> {result.ammoUsed}
          </p>
          <p>
            <span className="text-zinc-500">Your Carry Capacity:</span>{" "}
            {result.carryCapacity} slots
          </p>
        </section>

        <section>
          <p className="mb-2 text-sm font-semibold tracking-wider">LOOT FOUND</p>
          {result.lootFound.length > 0 ? (
            <ul className="grid gap-1 text-sm text-zinc-400">
              {result.lootFound.map((lootItem, index) => (
                <li key={`${lootItem.id}-${index}`}>- {lootItem.name}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-zinc-500">No loot recovered.</p>
          )}
        </section>

        {result.lootLeftBehind.length > 0 && (
          <section>
            <p className="mb-2 text-sm font-semibold tracking-wider">
              LEFT BEHIND
            </p>
            <ul className="grid gap-1 text-sm text-zinc-500">
              {result.lootLeftBehind.map((lootItem, index) => (
                <li key={`${lootItem.id}-${index}`}>- {lootItem.name}</li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <p className="mb-2 text-sm font-semibold tracking-wider">RAID LOG</p>
          <ul className="grid gap-1 text-sm text-zinc-400">
            {result.log.map((logEntry, index) => (
              <li key={`${logEntry}-${index}`}>- {logEntry}</li>
            ))}
          </ul>
        </section>
      </div>
    </Panel>
  );
}
