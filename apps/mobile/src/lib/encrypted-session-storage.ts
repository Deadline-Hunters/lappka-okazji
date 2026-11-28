type Storage = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
};

type SessionCipher = {
  generateKey(): Promise<string>;
  encrypt(value: string, key: string): Promise<string>;
  decrypt(value: string, key: string): Promise<string>;
};

export function createEncryptedSessionStorage(
  storage: Storage,
  secureStorage: Storage,
  cipher: SessionCipher,
): Storage {
  const pending = new Map<string, Promise<void>>();

  function serialize<T>(key: string, operation: () => Promise<T>): Promise<T> {
    const previous = pending.get(key) ?? Promise.resolve();
    const result = previous.then(operation);
    const settled = result.then(
      () => undefined,
      () => undefined,
    );
    pending.set(key, settled);
    void settled.then(() => {
      if (pending.get(key) === settled) pending.delete(key);
    });
    return result;
  }

  function encryptedKey(key: string) {
    return `${key}.encrypted`;
  }

  function secureKey(key: string) {
    return `lappka.auth.key.${key}`;
  }

  async function save(key: string, value: string) {
    let encryptionKey = await secureStorage.getItem(secureKey(key));
    if (encryptionKey === null) {
      if ((await storage.getItem(encryptedKey(key))) !== null) {
        throw new Error("Missing session encryption key");
      }
      encryptionKey = await cipher.generateKey();
      await secureStorage.setItem(secureKey(key), encryptionKey);
    }

    const encrypted = await cipher.encrypt(value, encryptionKey);
    await storage.setItem(encryptedKey(key), encrypted);
    await storage.removeItem(key);
  }

  return {
    getItem(key) {
      return serialize(key, async () => {
        const encrypted = await storage.getItem(encryptedKey(key));
        if (encrypted !== null) {
          const encryptionKey = await secureStorage.getItem(secureKey(key));
          if (encryptionKey === null) {
            throw new Error("Missing session encryption key");
          }
          const value = await cipher.decrypt(encrypted, encryptionKey);
          await storage.removeItem(key);
          return value;
        }

        const legacyValue = await storage.getItem(key);
        if (legacyValue !== null) await save(key, legacyValue);
        return legacyValue;
      });
    },
    setItem(key, value) {
      return serialize(key, () => save(key, value));
    },
    removeItem(key) {
      return serialize(key, async () => {
        await secureStorage.removeItem(secureKey(key));
        await storage.removeItem(key);
        await storage.removeItem(encryptedKey(key));
      });
    },
  };
}
