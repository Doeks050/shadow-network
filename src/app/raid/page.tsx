import GamePage from "@/components/GamePage";
import { loadout } from "@/data/loadout";
import { raidMaps } from "@/data/maps";

export default function RaidPage() {
  const selectedMap = raidMaps[0];

  return (
    <GamePage title="RAID">
      <div className="grid gap-6">
        <section>
          <h2 className="mb-3 font-bold tracking-wider">MAP</h2>
          <p>{selectedMap.name}</p>
          <p>Raid Timer: {selectedMap.durationMinutes} min</p>
          <p>
            Extract Window: {selectedMap.extractWindowStartMinutes}-
            {selectedMap.extractWindowEndMinutes} min
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-bold tracking-wider">LOADOUT</h2>
          <p>Primary: {loadout.primaryWeapon}</p>
          <p>Ammo: {loadout.primaryAmmo}</p>
          <p>Sidearm: {loadout.sidearm}</p>
          <p>Sidearm Ammo: {loadout.sidearmAmmo}</p>
          <p>Armor: {loadout.armor}</p>
          <p>Helmet: {loadout.helmet}</p>
          <p>Rig: {loadout.rig}</p>
          <p>Backpack: {loadout.backpack}</p>
          <p>Medical: {loadout.medical}</p>
        </section>

        <button className="w-full border border-zinc-700 bg-zinc-800 px-4 py-3 font-bold tracking-wider">
          DEPLOY
        </button>
      </div>
    </GamePage>
  );
}