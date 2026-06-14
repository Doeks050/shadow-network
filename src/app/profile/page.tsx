"use client";

import { useEffect, useState } from "react";
import GamePage from "@/components/GamePage";
import ActionButton from "@/components/ui/ActionButton";
import Panel from "@/components/ui/Panel";
import SectionTitle from "@/components/ui/SectionTitle";
import { player } from "@/data/player";
import {
  getStoredStash,
  type StoredStashItem,
} from "@/lib/playerStash";
import { resetStoredPlayerData } from "@/lib/playerReset";
import { getStoredWallet, type StoredWallet } from "@/lib/playerWallet";

function countTotalStashItems(stash: StoredStashItem[]): number {
  return stash.reduce((total, item) => total + item.quantity, 0);
}

export default function ProfilePage() {
  const [wallet, setWallet] = useState<StoredWallet>({
    cash: player.cash,
  });

  const [stash, setStash] = useState<StoredStashItem[]>([]);

  function refreshPlayerData() {
    setWallet(getStoredWallet());
    setStash(getStoredStash());
  }

  function handleResetPlayerData() {
    resetStoredPlayerData();
    refreshPlayerData();
  }

  useEffect(() => {
    refreshPlayerData();
  }, []);

  return (
    <GamePage title="PROFILE">
      <div className="grid gap-5">
        <Panel>
          <div className="grid gap-4">
            <SectionTitle>OPERATOR PROFILE</SectionTitle>

            <div className="grid gap-2 text-sm text-zinc-400">
              <p>
                <span className="text-zinc-500">Name:</span> {player.pmcName}
              </p>
              <p>
                <span className="text-zinc-500">Level:</span> {player.level}
              </p>
              <p>
                <span className="text-zinc-500">Cash:</span> $
                {wallet.cash.toLocaleString()}
              </p>
              <p>
                <span className="text-zinc-500">Income/hr:</span> $
                {player.incomePerHour.toLocaleString()}
              </p>
            </div>
          </div>
        </Panel>

        <Panel>
          <div className="grid gap-4">
            <SectionTitle>LOCAL SAVE STATUS</SectionTitle>

            <div className="grid gap-2 text-sm text-zinc-400">
              <p>
                <span className="text-zinc-500">Total stash items:</span>{" "}
                {countTotalStashItems(stash)}
              </p>
              <p>
                <span className="text-zinc-500">Unique item types:</span>{" "}
                {stash.length}
              </p>
              <p>
                <span className="text-zinc-500">Save type:</span> Browser
                localStorage
              </p>
            </div>
          </div>
        </Panel>

        <Panel className="border-red-900/60 bg-red-950/20">
          <div className="grid gap-4">
            <SectionTitle>DEVELOPMENT RESET</SectionTitle>

            <p className="text-sm text-zinc-400">
              Reset local player progress. This clears your wallet and stash in
              this browser only.
            </p>

            <div>
              <ActionButton onClick={handleResetPlayerData}>
                Reset Player Data
              </ActionButton>
            </div>
          </div>
        </Panel>
      </div>
    </GamePage>
  );
}
