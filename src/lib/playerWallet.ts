const WALLET_STORAGE_KEY = "shadow-network-wallet";

export type StoredWallet = {
  cash: number;
};

export const defaultWallet: StoredWallet = {
  cash: 25000,
};

export function getStoredWallet(): StoredWallet {
  if (typeof window === "undefined") {
    return defaultWallet;
  }

  const rawWallet = window.localStorage.getItem(WALLET_STORAGE_KEY);

  if (!rawWallet) {
    return defaultWallet;
  }

  try {
    const parsed = JSON.parse(rawWallet);

    return {
      cash:
        typeof parsed.cash === "number" && Number.isFinite(parsed.cash)
          ? parsed.cash
          : defaultWallet.cash,
    };
  } catch {
    return defaultWallet;
  }
}

export function saveStoredWallet(wallet: StoredWallet) {
  window.localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(wallet));
}

export function spendCashFromWallet(amount: number): boolean {
  const wallet = getStoredWallet();

  if (wallet.cash < amount) {
    return false;
  }

  saveStoredWallet({
    cash: wallet.cash - amount,
  });

  return true;
}

export function addCashToWallet(amount: number) {
  const wallet = getStoredWallet();

  saveStoredWallet({
    cash: wallet.cash + amount,
  });
}

export function clearStoredWallet() {
  window.localStorage.removeItem(WALLET_STORAGE_KEY);
}
