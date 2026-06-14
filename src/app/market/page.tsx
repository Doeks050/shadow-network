import GamePage from "@/components/GamePage";
import ItemBrowser from "@/components/items/ItemBrowser";
import ActionButton from "@/components/ui/ActionButton";
import SectionTitle from "@/components/ui/SectionTitle";
import { items } from "@/data/items";

export default function MarketPage() {
  return (
    <GamePage title="MARKET">
      <div className="grid gap-5">
        <section>
          <SectionTitle>TRADER MARKET</SectionTitle>
          <p className="text-sm text-zinc-400">
            Buy and sell weapons, ammo, gear, medical supplies and loot.
          </p>
        </section>

        <ItemBrowser
          items={items}
          renderActions={() => (
            <div className="grid grid-cols-2 gap-2">
              <ActionButton>Buy</ActionButton>
              <ActionButton>Sell</ActionButton>
            </div>
          )}
        />
      </div>
    </GamePage>
  );
}
