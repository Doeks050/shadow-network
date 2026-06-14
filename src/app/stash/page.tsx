import GamePage from "@/components/GamePage";
import ItemBrowser from "@/components/items/ItemBrowser";
import { items } from "@/data/items";

export default function StashPage() {
  return (
    <GamePage title="STASH">
      <ItemBrowser items={items} />
    </GamePage>
  );
}
