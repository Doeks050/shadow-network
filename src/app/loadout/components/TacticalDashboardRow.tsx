type TacticalDashboardRowProps = {
  label: string;
  title: string;
  subtitle?: string;
  statusLabel?: string;
  statusValue?: string;
  onClick: () => void;
  tall?: boolean;
};

export default function TacticalDashboardRow({
  label,
  title,
  subtitle,
  statusLabel,
  statusValue,
  onClick,
  tall = false,
}: TacticalDashboardRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`grid w-full grid-cols-[1fr_86px_18px] items-center gap-2 border-b border-zinc-800/70 bg-black/20 px-3 text-left last:border-b-0 active:bg-zinc-900/80 ${
        tall ? "min-h-[92px] py-3" : "min-h-[74px] py-2.5"
      }`}
    >
      <div className="min-w-0">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-lime-500">
          {label}
        </p>
        <p className="mt-1 truncate text-xl font-semibold uppercase tracking-wide text-zinc-100">
          {title}
        </p>
        {subtitle && (
          <p className="mt-0.5 truncate text-sm font-medium text-zinc-500">
            {subtitle}
          </p>
        )}
      </div>

      <div className="min-w-0 text-left">
        {statusLabel && (
          <p className="truncate text-[10px] font-black uppercase tracking-[0.14em] text-lime-500">
            {statusLabel}
          </p>
        )}
        {statusValue && (
          <p className="mt-1 truncate text-sm font-semibold tabular-nums tracking-wide text-zinc-200">
            {statusValue}
          </p>
        )}
      </div>

      <span className="text-3xl font-light leading-none text-zinc-500">›</span>
    </button>
  );
}
