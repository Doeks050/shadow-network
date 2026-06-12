import type { GameItem } from "@/data/items";

type ItemCardProps = {
  item: GameItem;
  children?: React.ReactNode;
};

export default function ItemCard({ item, children }: ItemCardProps) {
  return (
    <div className="border border-zinc-800 bg-zinc-950 px-4 py-3">
      <p className="font-semibold">{item.name}</p>
      <p className="text-sm text-zinc-400">Category: {item.category}</p>
      <p className="text-sm text-zinc-400">Rarity: {item.rarity}</p>
      <p className="text-sm text-zinc-400">
        Value: ${item.value.toLocaleString()}
      </p>

      {children && <div className="mt-2">{children}</div>}
    </div>
  );
}
