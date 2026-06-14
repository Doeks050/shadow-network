const WALLET_STORAGE_KEY = "shadow-network-wallet";

export type StoredWallet = {
  cash: number;
};

const defaultWallet: StoredWallet = {
  cash: 1000,
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

    if (typeof parsed.cash !== "number") {
      return defaultWallet;
    }

    return parsed;
  } catch {
    return defaultWallet;
  }
}

export function saveStoredWallet(wallet: StoredWallet) {
  window.localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(wallet));
}

export function addCashToWallet(amount: number) {
  const wallet = getStoredWallet();

  saveStoredWallet({
    cash: wallet.cash + amount,
  });
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

export function clearStoredWallet() {
  window.localStorage.removeItem(WALLET_STORAGE_KEY);
}
