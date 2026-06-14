import { clearStoredLoadout } from "@/lib/playerLoadout";
import { clearStoredStash } from "@/lib/playerStash";
import { clearStoredWallet } from "@/lib/playerWallet";

export function resetStoredPlayerData() {
  clearStoredStash();
  clearStoredWallet();
  clearStoredLoadout();
}
