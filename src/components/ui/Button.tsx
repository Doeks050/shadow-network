type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  type?: "button" | "submit";
};

export default function Button({
  children,
  onClick,
  active = false,
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`border px-3 py-2 text-xs font-semibold uppercase tracking-wider transition ${
        active
          ? "border-zinc-300 bg-zinc-100 text-zinc-950"
          : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-600 hover:text-zinc-100"
      }`}
    >
      {children}
    </button>
  );
}
