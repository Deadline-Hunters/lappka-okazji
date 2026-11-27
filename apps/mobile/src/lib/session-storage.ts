import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  AESEncryptionKey,
  AESSealedData,
  aesDecryptAsync,
  aesEncryptAsync,
} from "expo-crypto";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import { createEncryptedSessionStorage } from "./encrypted-session-storage";
import { decodeSession, encodeSession } from "./session-encoding";

const secureStorage = {
  getItem: SecureStore.getItemAsync,
  setItem: SecureStore.setItemAsync,
  removeItem: SecureStore.deleteItemAsync,
};

const encryptedStorage = createEncryptedSessionStorage(
  AsyncStorage,
  secureStorage,
  {
    async generateKey() {
      return (await AESEncryptionKey.generate()).encoded("hex");
    },
    async encrypt(value, key) {
      const encryptionKey = await AESEncryptionKey.import(key, "hex");
      const sealed = await aesEncryptAsync(encodeSession(value), encryptionKey);
      return sealed.combined("base64");
    },
    async decrypt(value, key) {
      const encryptionKey = await AESEncryptionKey.import(key, "hex");
      const bytes = await aesDecryptAsync(
        AESSealedData.fromCombined(value),
        encryptionKey,
      );
      return decodeSession(bytes);
    },
  },
);

// SecureStore is unavailable on web; retain the existing browser storage.
export const sessionStorage =
  Platform.OS === "web" ? AsyncStorage : encryptedStorage;
