import ActionButton from "@/components/ui/ActionButton";

type LoadoutSummaryBarProps = {
  combatScore: number;
  protectionScore: number;
  onSave: () => void;
};

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-l border-zinc-800 px-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-600">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold tabular-nums text-zinc-100">
        {value}
      </p>
    </div>
  );
}

export default function LoadoutSummaryBar({
  combatScore,
  protectionScore,
  onSave,
}: LoadoutSummaryBarProps) {
  return (
    <div className="sticky top-0 z-20 -mx-4 border-b border-zinc-800 bg-black/95 px-4 py-3 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-600">
            Shadow Network
          </p>
          <h1 className="mt-1 text-3xl font-black uppercase tracking-[0.08em] text-zinc-100">
            Loadout
          </h1>
        </div>

        <ActionButton onClick={onSave}>Confirm</ActionButton>
      </div>

      <div className="mt-3 flex border-t border-zinc-900 pt-3">
        <div className="pr-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-600">
            Preset
          </p>
          <p className="mt-1 text-sm font-semibold text-zinc-300">Custom 1</p>
        </div>

        <StatBox label="Combat" value={combatScore} />
        <StatBox label="Armor" value={protectionScore} />
      </div>
    </div>
  );
}
