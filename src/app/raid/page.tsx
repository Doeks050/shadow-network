"use client";

import { useState } from "react";
import GamePage from "@/components/GamePage";
import LoadoutSummary from "@/components/loadout/LoadoutSummary";
import RaidMapCard from "@/components/raid/RaidMapCard";
import RaidResultCard from "@/components/raid/RaidResultCard";
import ActionButton from "@/components/ui/ActionButton";
import SectionTitle from "@/components/ui/SectionTitle";
import { loadout } from "@/data/loadout";
import { raidMaps } from "@/data/maps";
import { addItemsToStash } from "@/lib/playerStash";
import { addCashToWallet } from "@/lib/playerWallet";
import { simulateRaid } from "@/lib/raidSimulation";
import type { RaidResult } from "@/lib/raidSimulation";

export default function RaidPage() {
  const selectedMap = raidMaps[0];
  const [raidResult, setRaidResult] = useState<RaidResult | null>(null);
  const [stashMessage, setStashMessage] = useState<string | null>(null);

  function handleDeploy() {
    const result = simulateRaid(selectedMap, loadout);

    if (result.success) {
      addCashToWallet(result.cashFound);

      if (result.lootFound.length > 0) {
        addItemsToStash(result.lootFound);
      }

      setStashMessage(
        `$${result.cashFound.toLocaleString()} and ${result.lootFound.length} item(s) added to stash.`
      );
    } else {
      setStashMessage(null);
    }

    setRaidResult(result);
  }

  return (
    <GamePage title="RAID">
      <div className="grid gap-6">
        <RaidMapCard map={selectedMap} />

        <section>
          <SectionTitle>LOADOUT</SectionTitle>
          <LoadoutSummary loadout={loadout} />
        </section>

        <ActionButton onClick={handleDeploy}>Deploy</ActionButton>

        {stashMessage && (
          <p className="text-sm font-semibold text-emerald-400">
            {stashMessage}
          </p>
        )}

        {raidResult && <RaidResultCard result={raidResult} />}
      </div>
    </GamePage>
  );
}
