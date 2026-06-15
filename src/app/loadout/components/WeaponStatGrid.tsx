type WeaponStatLine = {
  label: string;
  value: string;
  modifier?: number;
};

type WeaponStatGridProps = {
  lines: WeaponStatLine[];
};

function formatModifier(modifier?: number): string {
  if (!modifier) {
    return "";
  }

  return modifier > 0 ? `+${modifier}` : String(modifier);
}

export default function WeaponStatGrid({ lines }: WeaponStatGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {lines.map((line) => {
        const modifier = formatModifier(line.modifier);

        return (
          <div
            key={line.label}
            className="rounded border border-zinc-800 bg-black/30 px-3 py-2"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                {line.label}
              </p>

              {modifier && (
                <span
                  className={`text-xs font-black ${
                    modifier.startsWith("+")
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {modifier}
                </span>
              )}
            </div>

            <p className="mt-1 text-lg font-black text-zinc-100">{line.value}</p>
          </div>
        );
      })}
    </div>
  );
}
