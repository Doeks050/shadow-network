type TacticalLoadoutPanelProps = {
  title: string;
  children: React.ReactNode;
};

export default function TacticalLoadoutPanel({
  title,
  children,
}: TacticalLoadoutPanelProps) {
  return (
    <section className="overflow-hidden rounded border border-zinc-800 bg-black/45">
      <div className="border-b border-zinc-800 bg-zinc-950/80 px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-500">
          {title}
        </p>
      </div>

      <div>{children}</div>
    </section>
  );
}
