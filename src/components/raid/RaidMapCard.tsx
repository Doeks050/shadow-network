import SectionTitle from "@/components/ui/SectionTitle";
import type { RaidMap } from "@/data/maps";

type RaidMapCardProps = {
  map: RaidMap;
};

export default function RaidMapCard({ map }: RaidMapCardProps) {
  return (
    <section>
      <SectionTitle>MAP</SectionTitle>
      <p>{map.name}</p>
      <p className="text-sm text-zinc-400">
        Raid Timer: {map.durationMinutes} min
      </p>
      <p className="text-sm text-zinc-400">
        Extract Window: {map.extractWindowStartMinutes}-
        {map.extractWindowEndMinutes} min
      </p>
      <p className="text-sm text-zinc-400">
        Required Level: {map.requiredLevel}
      </p>
    </section>
  );
}
