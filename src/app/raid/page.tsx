import GamePage from "@/components/GamePage";

export default function RaidPage() {
  return (
    <GamePage title="RAID">
      <p>Map: Korvak</p>
      <p>Raid Timer: 30 min</p>
      <button className="mt-6 w-full border border-zinc-700 bg-zinc-800 px-4 py-3 font-bold tracking-wider">
        DEPLOY
      </button>
    </GamePage>
  );
}
