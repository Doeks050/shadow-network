type ActionButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
};

export default function ActionButton({
  children,
  onClick,
  type = "button",
}: ActionButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 transition hover:border-zinc-600 hover:text-zinc-100"
    >
      {children}
    </button>
  );
}
