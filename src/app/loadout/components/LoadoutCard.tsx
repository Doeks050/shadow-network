type LoadoutCardProps = {
  label: string;
  title: string;
  subtitle?: string;
  meta?: string;
  statLine?: string;
  actionLabel: string;
  onClick: () => void;
  tone?: "weapon" | "armor" | "storage";
};

export default function LoadoutCard({
  label,
  title,
  subtitle,
  meta,
  statLine,
  actionLabel,
  onClick,
}: LoadoutCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full border-b border-zinc-800/80 bg-black/35 px-4 py-4 text-left transition active:bg-zinc-900/80"
    >
      <div className="grid grid-cols-[1fr_auto_24px] items-center gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-lime-500">
            {label}
          </p>

          <h3 className="mt-1 truncate text-xl font-semibold uppercase tracking-wide text-zinc-100">
            {title}
          </h3>

          {subtitle && (
            <p className="mt-1 truncate text-sm font-medium text-zinc-500">
              {subtitle}
            </p>
          )}
        </div>

        <div className="text-right">
          {meta && (
            <p className="text-base font-semibold tabular-nums text-zinc-200">
              {meta}
            </p>
          )}

          {statLine && (
            <p className="mt-1 max-w-[150px] truncate text-xs font-semibold uppercase tracking-wider text-zinc-500">
              {statLine}
            </p>
          )}

          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-600">
            {actionLabel}
          </p>
        </div>

        <span className="text-3xl font-light leading-none text-zinc-600 group-active:text-lime-500">
          ›
        </span>
      </div>
    </button>
  );
}
