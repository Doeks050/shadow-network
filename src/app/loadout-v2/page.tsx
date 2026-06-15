"use client";

type WeaponRowProps = {
  label: string;
  name: string;
  caliber: string;
  visual: string;
};

type GearRowProps = {
  label: string;
  name: string;
  metricLabel: string;
  metricValue: string;
  icon: string;
  bar?: number;
};

type MiniLineProps = {
  label: string;
  value: string;
  icon?: string;
  danger?: boolean;
};

function TopHud() {
  return (
    <header className="border-b border-zinc-900 bg-black/95">
      <div className="grid grid-cols-[42px_1fr_auto] items-center gap-2 px-3 py-1.5">
        <div className="h-10 w-10 overflow-hidden border border-lime-700/80 bg-zinc-950">
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle,rgba(132,204,22,0.12),transparent_62%)] text-xl text-zinc-500">
            ◉
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-[11px] font-black uppercase tracking-[0.12em] text-zinc-200">
              Ghostline
            </p>
            <span className="text-xs text-lime-500">▣</span>
          </div>
          <div className="mt-0.5 flex items-center gap-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Lv. 36
            </p>
            <div className="h-1 w-16 bg-zinc-800">
              <div className="h-full w-1/3 bg-lime-500" />
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[10px] font-black uppercase tracking-wider text-zinc-600">
            Cash
          </p>
          <p className="mt-1 text-sm font-bold tabular-nums text-zinc-200">
            $1,248,750
          </p>
        </div>
      </div>
    </header>
  );
}

function TitleBlock() {
  return (
    <section className="px-3 pt-3">
      <div className="flex items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 bg-lime-500" />
          <h1 className="text-3xl font-black uppercase leading-none tracking-[0.08em] text-zinc-100">
            Loadout
          </h1>
        </div>


      </div>

    </section>
  );
}

function Panel({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`overflow-hidden border border-zinc-800 bg-black/55 shadow-[inset_0_0_26px_rgba(255,255,255,0.018)] ${className}`}
    >
      {title && (
        <div className="border-b border-zinc-800/80 bg-black/45 px-3 py-1.5">
          <p className="text-[10px] font-black uppercase tracking-[0.17em] text-lime-500">
            {title}
          </p>
        </div>
      )}
      {children}
    </section>
  );
}

function WeaponRow({
  label,
  name,
  caliber,
  visual,
}: WeaponRowProps) {
  return (
    <button
      type="button"
      className="grid min-h-[74px] w-full grid-cols-[1fr_104px_18px] items-center gap-2 border-b border-zinc-800/75 bg-black/20 px-3 py-2 text-left last:border-b-0 active:bg-zinc-900"
    >
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-lime-500">
          {label}
        </p>
        <p className="mt-1 truncate text-lg font-semibold uppercase tracking-wide text-zinc-100">
          {name}
        </p>
        <p className="mt-0.5 text-xs font-medium text-zinc-500">{caliber}</p>
      </div>

      <div className="flex h-14 items-center justify-center overflow-hidden border border-zinc-800 bg-black/45">
        <span className="text-3xl leading-none text-zinc-500">{visual}</span>
      </div>

      <span className="text-2xl font-light leading-none text-zinc-500">›</span>
    </button>
  );
}

function GearRow({
  label,
  name,
  metricLabel,
  metricValue,
  icon,
  bar,
}: GearRowProps) {
  return (
    <button
      type="button"
      className="grid min-h-[56px] w-full grid-cols-[40px_1fr_66px_16px] items-center gap-2 border-b border-zinc-800/75 bg-black/20 px-3 py-1.5 text-left last:border-b-0 active:bg-zinc-900"
    >
      <div className="flex h-8 w-8 items-center justify-center bg-black/40 text-sm text-zinc-500">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-lime-500">
          {label}
        </p>
        <p className="mt-1 truncate text-base font-medium text-zinc-100">{name}</p>
      </div>

      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500">
          {metricLabel}
        </p>
        <p className="mt-1 text-sm font-semibold tabular-nums text-zinc-100">
          {metricValue}
        </p>
        {typeof bar === "number" && (
          <div className="mt-1 h-1 bg-zinc-800">
            <div className="h-full bg-lime-500" style={{ width: `${bar}%` }} />
          </div>
        )}
      </div>

      <span className="text-xl font-light text-zinc-500">›</span>
    </button>
  );
}

function MiniLine({ label, value, icon, danger }: MiniLineProps) {
  return (
    <div className="grid grid-cols-[20px_1fr_auto] items-center gap-2 border-b border-zinc-900 px-3 py-1.5 last:border-b-0">
      <span className="text-sm text-zinc-500">{icon ?? "•"}</span>
      <p className="truncate text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p
        className={`text-sm font-semibold tabular-nums ${
          danger ? "text-orange-500" : "text-zinc-200"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function ConfirmButton() {
  return (
    <button
      type="button"
      className="mx-3 border border-lime-700/80 bg-lime-950/25 px-4 py-3 text-center text-xl font-black uppercase tracking-[0.16em] text-lime-400 shadow-[inset_0_0_22px_rgba(132,204,22,0.16)] active:bg-lime-900/35"
    >
      Confirm Loadout
    </button>
  );
}

function BottomNav() {
  const items = [
    ["⌂", "Home"],
    ["▰", "Loadout"],
    ["▣", "Stash"],
    ["⇄", "Traders"],
    ["⌖", "Missions"],
    ["•••", "More"],
  ];

  return (
    <nav className="border-t border-zinc-900 bg-black">
      <div className="grid grid-cols-6">
        {items.map(([icon, label]) => {
          const active = label === "Loadout";

          return (
            <button
              key={label}
              type="button"
              className={`flex min-h-[54px] flex-col items-center justify-center gap-1 border-r border-zinc-900 last:border-r-0 ${
                active
                  ? "bg-lime-950/25 text-lime-400 shadow-[inset_0_2px_0_rgba(132,204,22,0.75)]"
                  : "text-zinc-600"
              }`}
            >
              <span className="text-base leading-none">{icon}</span>
              <span className="text-[10px] font-black uppercase tracking-wider">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default function LoadoutV2Page() {
  return (
    <main className="min-h-screen bg-black text-zinc-100">
      <div className="mx-auto min-h-screen w-full max-w-[430px] bg-[radial-gradient(circle_at_top,rgba(63,63,70,0.22),transparent_35%),linear-gradient(180deg,#020202_0%,#090909_100%)]">
        <TopHud />

        <div className="grid gap-2 pb-2">
          <TitleBlock />

          <div className="grid gap-2 px-3">
            <Panel>
              <WeaponRow
                label="Primary Weapon"
                name="HK416A5"
                caliber="5.56×45 NATO"
                visual="▰"
              />
              <WeaponRow
                label="Secondary Weapon"
                name="MPX"
                caliber="9×19mm"
                visual="▰"
              />
            </Panel>

            <Panel>
              <GearRow
                label="Headgear"
                name="Fast MT"
                metricLabel="Durability"
                metricValue="40 / 40"
                icon="◖"
                bar={65}
              />
              <GearRow
                label="Chestgear"
                name="Tac Rig MK3"
                metricLabel="Durability"
                metricValue="110 / 110"
                icon="▤"
                bar={92}
              />
              <GearRow
                label="Backpack"
                name="Pathfinder 45L"
                metricLabel="Slots"
                metricValue="8 / 30"
                icon="▧"
              />
              <GearRow
                label="Pouch"
                name="Gamma"
                metricLabel="Slots"
                metricValue="0 / 4"
                icon="▣"
              />
            </Panel>

            <div className="grid grid-cols-2 gap-2">
              <Panel title="Loadout Stats">
                <MiniLine icon="♜" label="Weight" value="34.7 / 65 kg" />
                <MiniLine icon="◆" label="Armor" value="110 / 110" />
                <MiniLine icon="↯" label="Mobility" value="82 / 100" />
                <MiniLine icon="⌁" label="Ergonomics" value="68 / 100" />
                <MiniLine icon="≋" label="Noise" value="32 / 100" />
                <MiniLine icon="✚" label="Survival Chance" value="72%" />
              </Panel>
            </div>
          </div>

          <ConfirmButton />
        </div>

        <BottomNav />
      </div>
    </main>
  );
}
