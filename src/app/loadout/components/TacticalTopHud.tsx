type TacticalTopHudProps = {
  playerName?: string;
  level?: number;
  cash?: number;
  coins?: number;
};

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export default function TacticalTopHud({
  playerName = "GHOSTLINE",
  level = 36,
  cash = 1248750,
  coins = 2370,
}: TacticalTopHudProps) {
  return (
    <header className="-mx-4 border-b border-zinc-900 bg-black/95 px-4 py-2.5">
      <div className="grid grid-cols-[52px_1fr_auto] items-center gap-3">
        <div className="h-12 w-12 overflow-hidden border border-lime-700/70 bg-zinc-950 shadow-[0_0_16px_rgba(132,204,22,0.08)]">
          <div className="flex h-full w-full items-center justify-center text-lg text-zinc-500">
            ◉
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-base font-black uppercase tracking-[0.14em] text-zinc-200">
              {playerName}
            </p>
            <span className="text-xs text-lime-500">▣</span>
          </div>

          <div className="mt-1 flex items-center gap-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              LV. {level}
            </p>
            <div className="h-1 w-20 bg-zinc-800">
              <div className="h-full w-1/3 bg-lime-500" />
            </div>
          </div>
        </div>

        <div className="grid gap-0.5 text-right">
          <p className="text-xs font-bold tabular-nums text-zinc-300">
            ▣ {formatNumber(cash)}
          </p>
          <p className="text-xs font-bold tabular-nums text-zinc-300">
            ◉ {formatNumber(coins)}
          </p>
        </div>
      </div>
    </header>
  );
}
