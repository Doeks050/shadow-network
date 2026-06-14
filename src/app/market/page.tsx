"use client";

import { useEffect, useState } from "react";
import GamePage from "@/components/GamePage";
import ActionButton from "@/components/ui/ActionButton";
import Button from "@/components/ui/Button";
import Panel from "@/components/ui/Panel";
import SectionTitle from "@/components/ui/SectionTitle";
import { marketCategorySections } from "@/config/market.config";
import type { GameItem } from "@/data/items";
import { formatCash } from "@/lib/format";
import {
  getMarketDisplayListings,
  getSellListings,
  getSellPriceForItem,
  type MarketDisplayListing,
  type SellDisplayListing,
} from "@/lib/market";
import {
  addItemsToStash,
  getStoredStash,
  removeOneItemFromStash,
  type StoredStashItem,
} from "@/lib/playerStash";
import {
  addCashToWallet,
  getStoredWallet,
  spendCashFromWallet,
  type StoredWallet,
} from "@/lib/playerWallet";

type QuantityState = Record<string, number>;

type WeaponFilter = "all" | "pistol" | "smg" | "assault_rifle" | "battle_rifle" | "marksman_rifle" | "sniper_rifle";

const weaponFilters: { id: WeaponFilter; label: string }[] = [
  { id: "all", label: "All Weapons" },
  { id: "pistol", label: "Pistols" },
  { id: "smg", label: "SMGs" },
  { id: "assault_rifle", label: "Assault Rifles" },
  { id: "battle_rifle", label: "Battle Rifles" },
  { id: "marksman_rifle", label: "Marksman Rifles" },
  { id: "sniper_rifle", label: "Sniper Rifles" },
];

function isAmmo(item: GameItem): boolean {
  return item.category === "ammo";
}

function isWeapon(item: GameItem): boolean {
  return item.category === "weapon";
}

function getWeaponType(item: GameItem): string | null {
  if (item.category !== "weapon") {
    return null;
  }

  return item.weaponType;
}

function clampQuantity(value: number): number {
  if (!Number.isFinite(value)) {
    return 1;
  }

  return Math.max(1, Math.min(999, Math.floor(value)));
}

function getListingsForCategories(
  listings: MarketDisplayListing[],
  categories: GameItem["category"][]
): MarketDisplayListing[] {
  return listings.filter((listing) => categories.includes(listing.item.category));
}

function getSellListingsForCategories(
  listings: SellDisplayListing[],
  categories: GameItem["category"][]
): SellDisplayListing[] {
  return listings.filter((listing) => categories.includes(listing.item.category));
}

function filterWeaponBuyListings(
  listings: MarketDisplayListing[],
  activeWeaponFilter: WeaponFilter
): MarketDisplayListing[] {
  if (activeWeaponFilter === "all") {
    return listings;
  }

  return listings.filter(
    (listing) => getWeaponType(listing.item) === activeWeaponFilter
  );
}

function filterWeaponSellListings(
  listings: SellDisplayListing[],
  activeWeaponFilter: WeaponFilter
): SellDisplayListing[] {
  if (activeWeaponFilter === "all") {
    return listings;
  }

  return listings.filter(
    (listing) => getWeaponType(listing.item) === activeWeaponFilter
  );
}

export default function MarketPage() {
  const [wallet, setWallet] = useState<StoredWallet>({
    cash: 1000,
  });

  const [stash, setStash] = useState<StoredStashItem[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [buyQuantities, setBuyQuantities] = useState<QuantityState>({});
  const [activeWeaponFilter, setActiveWeaponFilter] = useState<WeaponFilter>("all");
  const [activeSectionId, setActiveSectionId] = useState(
    marketCategorySections[0].id
  );

  const activeSection =
    marketCategorySections.find((section) => section.id === activeSectionId) ??
    marketCategorySections[0];

  const isWeaponSection = activeSection.categories.includes("weapon");

  function refreshMarketData() {
    setWallet(getStoredWallet());
    setStash(getStoredStash());
  }

  function getBuyQuantity(itemId: string): number {
    return buyQuantities[itemId] ?? 1;
  }

  function handleQuantityChange(itemId: string, value: string) {
    setBuyQuantities((current) => ({
      ...current,
      [itemId]: clampQuantity(Number(value)),
    }));
  }

  function handleSectionChange(sectionId: string) {
    setActiveSectionId(sectionId);
    setActiveWeaponFilter("all");
    setMessage(null);
  }

  function handleBuy(listing: MarketDisplayListing) {
    const quantity = isAmmo(listing.item) ? getBuyQuantity(listing.item.id) : 1;
    const totalPrice = listing.price * quantity;
    const bought = spendCashFromWallet(totalPrice);

    if (!bought) {
      setMessage(
        `Not enough cash to buy ${quantity}x ${listing.item.name} for ${formatCash(
          totalPrice
        )}.`
      );
      refreshMarketData();
      return;
    }

    addItemsToStash(Array.from({ length: quantity }, () => listing.item));
    refreshMarketData();

    setMessage(
      `${quantity}x ${listing.item.name} bought for ${formatCash(totalPrice)}.`
    );
  }

  function handleSell(listing: SellDisplayListing) {
    const removed = removeOneItemFromStash(listing.item.id);

    if (!removed) {
      setMessage(`Could not sell ${listing.item.name}.`);
      refreshMarketData();
      return;
    }

    addCashToWallet(listing.sellPrice);
    refreshMarketData();
    setMessage(`${listing.item.name} sold for ${formatCash(listing.sellPrice)}.`);
  }

  useEffect(() => {
    refreshMarketData();
  }, []);

  const categoryBuyListings = getListingsForCategories(
    getMarketDisplayListings(),
    activeSection.categories
  );

  const categorySellListings = getSellListingsForCategories(
    getSellListings(stash),
    activeSection.categories
  );

  const buyListings = isWeaponSection
    ? filterWeaponBuyListings(categoryBuyListings, activeWeaponFilter)
    : categoryBuyListings;

  const sellListings = isWeaponSection
    ? filterWeaponSellListings(categorySellListings, activeWeaponFilter)
    : categorySellListings;

  return (
    <GamePage title="MARKET">
      <div className="grid gap-5">
        <Panel>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <SectionTitle>MARKET</SectionTitle>
              <p className="text-sm text-zinc-500">
                Active category:{" "}
                <span className="font-semibold text-zinc-100">
                  {activeSection.label}
                </span>
              </p>
            </div>

            <p className="text-sm text-zinc-400">
              Cash:{" "}
              <span className="font-bold text-zinc-100">
                {formatCash(wallet.cash)}
              </span>
            </p>
          </div>
        </Panel>

        <Panel>
          <div className="grid gap-3">
            <div className="flex flex-wrap gap-2">
              {marketCategorySections.map((section) => (
                <Button
                  key={section.id}
                  active={activeSectionId === section.id}
                  onClick={() => handleSectionChange(section.id)}
                >
                  {section.label}
                </Button>
              ))}
            </div>

            {isWeaponSection && (
              <div className="flex flex-wrap gap-2 border-t border-zinc-800 pt-3">
                {weaponFilters.map((filter) => (
                  <Button
                    key={filter.id}
                    active={activeWeaponFilter === filter.id}
                    onClick={() => setActiveWeaponFilter(filter.id)}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </Panel>

        {message && (
          <Panel className="border-emerald-900/60 bg-emerald-950/20">
            <p className="text-sm font-semibold text-emerald-400">{message}</p>
          </Panel>
        )}

        <Panel>
          <div className="grid gap-4">
            <SectionTitle>BUY {activeSection.label.toUpperCase()}</SectionTitle>

            {buyListings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 text-left text-xs uppercase tracking-wider text-zinc-500">
                      <th className="py-2 pr-3">Item</th>
                      {isWeaponSection && (
                        <th className="py-2 pr-3">Type</th>
                      )}
                      <th className="py-2 pr-3 text-right">Buy Price</th>
                      <th className="py-2 pr-3 text-right">Sell Price</th>
                      <th className="py-2 pr-3 text-right">Qty</th>
                      <th className="py-2 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {buyListings.map((listing) => {
                      const quantity = getBuyQuantity(listing.item.id);
                      const buyTotalPrice = isAmmo(listing.item)
                        ? listing.price * quantity
                        : listing.price;
                      const sellPrice = getSellPriceForItem(listing.item);

                      return (
                        <tr
                          key={listing.item.id}
                          className="border-b border-zinc-900 last:border-b-0"
                        >
                          <td className="py-2 pr-3 font-semibold text-zinc-100">
                            <button
                              type="button"
                              className="text-left hover:text-emerald-300"
                            >
                              {listing.item.name}
                            </button>
                          </td>

                          {isWeaponSection && (
                            <td className="py-2 pr-3 text-xs uppercase text-zinc-500">
                              {isWeapon(listing.item)
                                ? getWeaponType(listing.item)
                                : "-"}
                            </td>
                          )}

                          <td className="py-2 pr-3 text-right text-zinc-300">
                            {formatCash(buyTotalPrice)}
                          </td>

                          <td className="py-2 pr-3 text-right text-zinc-500">
                            {formatCash(sellPrice)}
                          </td>

                          <td className="py-2 pr-3 text-right">
                            {isAmmo(listing.item) ? (
                              <input
                                type="number"
                                min={1}
                                max={999}
                                value={quantity}
                                onChange={(event) =>
                                  handleQuantityChange(
                                    listing.item.id,
                                    event.target.value
                                  )
                                }
                                className="w-20 rounded border border-zinc-800 bg-zinc-950 px-2 py-1 text-right text-sm text-zinc-100 outline-none focus:border-emerald-700"
                              />
                            ) : (
                              <span className="text-zinc-600">1</span>
                            )}
                          </td>

                          <td className="py-2 text-right">
                            <ActionButton onClick={() => handleBuy(listing)}>
                              Buy
                            </ActionButton>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-zinc-500">
                No items for sale in this category.
              </p>
            )}
          </div>
        </Panel>

        <Panel>
          <div className="grid gap-4">
            <SectionTitle>SELL {activeSection.label.toUpperCase()}</SectionTitle>

            {sellListings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 text-left text-xs uppercase tracking-wider text-zinc-500">
                      <th className="py-2 pr-3">Item</th>
                      {isWeaponSection && (
                        <th className="py-2 pr-3">Type</th>
                      )}
                      <th className="py-2 pr-3 text-right">Owned</th>
                      <th className="py-2 pr-3 text-right">Sell Price</th>
                      <th className="py-2 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {sellListings.map((listing) => (
                      <tr
                        key={listing.item.id}
                        className="border-b border-zinc-900 last:border-b-0"
                      >
                        <td className="py-2 pr-3 font-semibold text-zinc-100">
                          <button
                            type="button"
                            className="text-left hover:text-emerald-300"
                          >
                            {listing.item.name}
                          </button>
                        </td>

                        {isWeaponSection && (
                          <td className="py-2 pr-3 text-xs uppercase text-zinc-500">
                            {isWeapon(listing.item)
                              ? getWeaponType(listing.item)
                              : "-"}
                          </td>
                        )}

                        <td className="py-2 pr-3 text-right text-zinc-400">
                          x{listing.quantity}
                        </td>

                        <td className="py-2 pr-3 text-right text-zinc-300">
                          {formatCash(listing.sellPrice)}
                        </td>

                        <td className="py-2 text-right">
                          <ActionButton onClick={() => handleSell(listing)}>
                            Sell
                          </ActionButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-zinc-500">
                You have no stash items in this category.
              </p>
            )}
          </div>
        </Panel>
      </div>
    </GamePage>
  );
}
