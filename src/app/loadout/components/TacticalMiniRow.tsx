type TacticalMiniRowProps = {
  label: string;
  value: string;
  right?: string;
};

export default function TacticalMiniRow({
  label,
  value,
  right,
}: TacticalMiniRowProps) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-zinc-900 px-4 py-2.5 last:border-b-0">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold uppercase tracking-wide text-zinc-500">
          {label}
        </p>
        <p className="mt-0.5 truncate text-base font-medium text-zinc-300">
          {value}
        </p>
      </div>
      {right && (
        <p className="text-base font-semibold tabular-nums text-zinc-200">
          {right}
        </p>
      )}
    </div>
  );
}
