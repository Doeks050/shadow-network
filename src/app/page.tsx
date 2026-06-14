"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import GamePage from "@/components/GamePage";
import Panel from "@/components/ui/Panel";
import SectionTitle from "@/components/ui/SectionTitle";
import { player } from "@/data/player";
import { formatCash } from "@/lib/format";
import { getStoredWallet, type StoredWallet } from "@/lib/playerWallet";

const mainMenuItems = [
  {
    label: "RAID",
    href: "/raid",
    description: "Deploy into hostile zones and extract with loot.",
  },
  {
    label: "LOADOUT",
    href: "/loadout",
    description: "Review your weapons, armor, backpack and combat readiness.",
  },
  {
    label: "STASH",
    href: "/stash",
    description: "Inspect recovered raid items stored in your stash.",
  },
  {
    label: "MARKET",
    href: "/market",
    description: "Buy and sell equipment, supplies and valuables.",
  },
  {
    label: "FOB",
    href: "/fob",
    description: "Upgrade your forward operating base.",
  },
  {
    label: "MISSIONS",
    href: "/missions",
    description: "Complete contracts and earn progression rewards.",
  },
  {
    label: "LEADERBOARD",
    href: "/leaderboard",
    description: "Compare your progress against other operators.",
  },
  {
    label: "PROFILE",
    href: "/profile",
    description: "View your operator identity and long-term stats.",
  },
];

export default function HomePage() {
  const [wallet, setWallet] = useState<StoredWallet>({
    cash: player.cash,
  });

  useEffect(() => {
    setWallet(getStoredWallet());
  }, []);

  return (
    <GamePage title="SHADOW NETWORK">
      <div className="grid gap-6">
        <Panel>
          <div className="grid gap-4">
            <SectionTitle>OPERATOR STATUS</SectionTitle>

            <div className="grid gap-2 text-sm text-zinc-400">
              <p>
                <span className="text-zinc-500">Name:</span> {player.pmcName}
              </p>
              <p>
                <span className="text-zinc-500">Level:</span> {player.level}
              </p>
              <p>
                <span className="text-zinc-500">Cash:</span>{" "}
                {formatCash(wallet.cash)}
              </p>
              <p>
                <span className="text-zinc-500">Income/hr:</span>{" "}
                {formatCash(player.incomePerHour)}
              </p>
            </div>
          </div>
        </Panel>

        <section className="grid gap-3">
          <SectionTitle>MAIN MENU</SectionTitle>

          <div className="grid gap-3">
            {mainMenuItems.map((item) => (
              <Panel key={item.href} className="bg-zinc-950">
                <div className="grid gap-3">
                  <div>
                    <p className="font-bold tracking-wider">{item.label}</p>
                    <p className="text-sm text-zinc-500">{item.description}</p>
                  </div>

                  <Link
                    href={item.href}
                    className="inline-flex w-fit items-center justify-center rounded border border-zinc-700 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-zinc-100 transition hover:border-zinc-400 hover:bg-zinc-900"
                  >
                    Open
                  </Link>
                </div>
              </Panel>
            ))}
          </div>
        </section>
      </div>
    </GamePage>
  );
}
