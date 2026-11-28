type CleanupDependencies = {
  waitForWrites(): Promise<void>;
  clearStorage(): Promise<void>;
  clearMarkers(): Promise<void>;
};

type LogoutDependencies = {
  markPending(): Promise<void>;
  signOut(): Promise<{ error: unknown }>;
  getSession(): Promise<{ data: { session: unknown }; error: unknown }>;
  clearLocalData(): Promise<void>;
};

export const SESSION_OWNER_KEY = "lappka:session:owner";
export const LOGOUT_PENDING_KEY = "lappka:session:logout-pending";
export const RESET_PENDING = "reset";

type SessionStorage = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
};

export function createMarkedSessionStorage(
  storage: SessionStorage,
  markSession: () => Promise<void>,
): SessionStorage {
  return {
    getItem: (key) => storage.getItem(key),
    removeItem: (key) => storage.removeItem(key),
    async setItem(key, value) {
      if (key.endsWith("-auth-token")) await markSession();
      await storage.setItem(key, value);
    },
  };
}

export async function clearLocalApplicationData({
  waitForWrites,
  clearStorage,
  clearMarkers,
}: CleanupDependencies): Promise<void> {
  await waitForWrites();
  await clearStorage();
  await clearMarkers();
}

export async function clearApplicationSession({
  markPending,
  signOut,
  getSession,
  clearLocalData,
}: LogoutDependencies): Promise<{ serverSignOutFailed: boolean }> {
  await markPending();
  const { error: signOutError } = await signOut();
  if (signOutError) {
    const { data, error } = await getSession();
    if (error || data.session) {
      throw new Error("Unable to clear the local authentication session");
    }
  }

  await clearLocalData();
  return { serverSignOutFailed: Boolean(signOutError) };
}

export async function resetLocalSession({
  markPending,
  clearStoredSession,
  clearLocalData,
}: {
  markPending(): Promise<void>;
  clearStoredSession(): Promise<void>;
  clearLocalData(): Promise<void>;
}): Promise<void> {
  await markPending();
  await clearStoredSession();
  await clearLocalData();
}

export function authStorageKeys(
  keys: readonly string[],
  sessionKey: string,
): string[] {
  const authKeys = new Set([sessionKey]);
  for (const key of keys) {
    const baseKey = key.endsWith(".encrypted")
      ? key.slice(0, -".encrypted".length)
      : key;
    if (baseKey === sessionKey || baseKey.startsWith(`${sessionKey}-`)) {
      authKeys.add(baseKey);
    }
  }
  return [...authKeys];
}

export function appStorageKeys(keys: readonly string[]): string[] {
  return keys.filter(
    (key) => key.startsWith("lappka.") || key.startsWith("lappka:"),
  );
}

export function withoutCleanupMarkers(keys: readonly string[]): string[] {
  return keys.filter(
    (key) => key !== SESSION_OWNER_KEY && key !== LOGOUT_PENDING_KEY,
  );
}
