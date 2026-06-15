type TacticalSectionProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;
};

export default function TacticalSection({
  title,
  children,
  className = "",
}: TacticalSectionProps) {
  return (
    <section
      className={`overflow-hidden border border-zinc-800/90 bg-black/50 shadow-[inset_0_0_28px_rgba(255,255,255,0.015)] ${className}`}
    >
      {title && (
        <div className="border-b border-zinc-800/80 bg-black/40 px-3 py-2">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-lime-500">
            {title}
          </p>
        </div>
      )}
      {children}
    </section>
  );
}
