type PanelProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Panel({ children, className = "" }: PanelProps) {
  return (
    <section className={`border border-zinc-800 bg-zinc-900/60 p-5 ${className}`}>
      {children}
    </section>
  );
}
