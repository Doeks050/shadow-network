type TacticalLoadoutRowProps = {
  label: string;
  title: string;
  subtitle?: string;
  rightLabel?: string;
  rightValue?: string;
  onClick: () => void;
};

export default function TacticalLoadoutRow({
  label,
  title,
  subtitle,
  rightLabel,
  rightValue,
  onClick,
}: TacticalLoadoutRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid min-h-[92px] w-full grid-cols-[1fr_auto_24px] items-center gap-3 border-b border-zinc-800/80 bg-black/20 px-4 py-3 text-left last:border-b-0 active:bg-zinc-900"
    >
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-lime-500">
          {label}
        </p>
        <p className="mt-1 truncate text-xl font-semibold uppercase tracking-wide text-zinc-100">
          {title}
        </p>
        {subtitle && (
          <p className="mt-1 truncate text-sm font-medium text-zinc-500">
            {subtitle}
          </p>
        )}
      </div>

      {(rightLabel || rightValue) && (
        <div className="min-w-[74px] text-left">
          {rightLabel && (
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-600">
              {rightLabel}
            </p>
          )}
          {rightValue && (
            <p className="mt-1 text-lg font-semibold tabular-nums text-zinc-100">
              {rightValue}
            </p>
          )}
        </div>
      )}

      <span className="text-3xl font-light leading-none text-zinc-600">›</span>
    </button>
  );
}
