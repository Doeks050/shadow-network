import GamePage from "@/components/GamePage";
import { items } from "@/data/items";

export default function StashPage() {
  return (
    <GamePage title="STASH">
      <div className="grid gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="border border-zinc-800 bg-zinc-950 px-4 py-3"
          >
            <p className="font-semibold">{item.name}</p>
            <p className="text-sm text-zinc-400">Category: {item.category}</p>
            <p className="text-sm text-zinc-400">
              Value: ${item.value.toLocaleString()}
            </p>

            {item.category === "weapon" && (
              <div className="mt-2 text-sm text-zinc-300">
                <p>Type: {item.weaponType}</p>
                <p>Ammo: {item.ammoType}</p>
                <p>Accuracy: {item.accuracy}</p>
                <p>Range: {item.range}</p>
                <p>Reliability: {item.reliability}</p>
              </div>
            )}

            {item.category === "ammo" && (
              <div className="mt-2 text-sm text-zinc-300">
                <p>Ammo Type: {item.ammoType}</p>
                <p>Damage: {item.damage}</p>
                <p>Armor Damage: {item.armorDamage}</p>
                <p>Accuracy: {item.accuracyModifier}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </GamePage>
  );
}