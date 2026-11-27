import assert from "node:assert/strict";
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import test from "node:test";
import { createClient } from "@supabase/supabase-js";

import { createEncryptedSessionStorage } from "./encrypted-session-storage.ts";
import { decodeSession, encodeSession } from "./session-encoding.ts";

function memoryStorage() {
  const values = new Map();
  return {
    values,
    async getItem(key) {
      return values.get(key) ?? null;
    },
    async setItem(key, value) {
      values.set(key, value);
    },
    async removeItem(key) {
      values.delete(key);
    },
  };
}

const cipher = {
  async generateKey() {
    return randomBytes(32).toString("hex");
  },
  async encrypt(value, key) {
    const iv = randomBytes(12);
    const aes = createCipheriv("aes-256-gcm", Buffer.from(key, "hex"), iv);
    const encrypted = Buffer.concat([
      aes.update(encodeSession(value)),
      aes.final(),
    ]);
    return Buffer.concat([iv, encrypted, aes.getAuthTag()]).toString("base64");
  },
  async decrypt(value, key) {
    const combined = Buffer.from(value, "base64");
    const aes = createDecipheriv(
      "aes-256-gcm",
      Buffer.from(key, "hex"),
      combined.subarray(0, 12),
    );
    aes.setAuthTag(combined.subarray(-16));
    return decodeSession(
      Buffer.concat([aes.update(combined.subarray(12, -16)), aes.final()]),
    );
  },
};

function setup() {
  const storage = memoryStorage();
  const secure = memoryStorage();
  return {
    storage,
    secure,
    session: createEncryptedSessionStorage(storage, secure, cipher),
  };
}

test("migrates a long existing session and restores it without plaintext", async () => {
  const { storage, secure, session } = setup();
  const value = JSON.stringify({ token: "ł🐾".repeat(3000) });
  await storage.setItem("session", value);

  assert.equal(await session.getItem("session"), value);
  assert.equal(await storage.getItem("session"), null);
  assert.notEqual(await storage.getItem("session.encrypted"), value);
  assert.equal((await secure.getItem("lappka.auth.key.session")).length, 64);
  const restarted = createEncryptedSessionStorage(storage, secure, cipher);
  assert.equal(await restarted.getItem("session"), value);
});

test("removes encrypted, secure and legacy session values on sign out", async () => {
  const { storage, secure, session } = setup();
  await session.setItem("session", "token");
  await storage.setItem("session", "old token");
  await session.removeItem("session");

  assert.equal(await storage.getItem("session"), null);
  assert.equal(await storage.getItem("session.encrypted"), null);
  assert.equal(await secure.getItem("lappka.auth.key.session"), null);
  assert.equal(await session.getItem("session"), null);
});

test("preserves the legacy session if secure storage fails", async () => {
  const { storage, secure } = setup();
  await storage.setItem("session", "old token");
  secure.setItem = async () => {
    throw new Error("storage unavailable");
  };
  const session = createEncryptedSessionStorage(storage, secure, cipher);
  await assert.rejects(session.getItem("session"), /storage unavailable/);
  assert.equal(await storage.getItem("session"), "old token");
});

test("rejects a missing key or tampered encrypted value", async () => {
  const { storage, secure, session } = setup();
  await session.setItem("session", "token");
  const encrypted = await storage.getItem("session.encrypted");
  await secure.removeItem("lappka.auth.key.session");
  await assert.rejects(
    session.getItem("session"),
    /Missing session encryption key/,
  );
  await assert.rejects(
    session.setItem("session", "new"),
    /Missing session encryption key/,
  );

  await secure.setItem("lappka.auth.key.session", await cipher.generateKey());
  await storage.setItem("session.encrypted", encrypted);
  await assert.rejects(session.getItem("session"));
});

test("serializes concurrent writes and removal", async () => {
  const { session } = setup();
  await Promise.all([
    session.setItem("session", "first"),
    session.setItem("session", "second"),
  ]);
  assert.equal(await session.getItem("session"), "second");
  await Promise.all([
    session.setItem("session", "third"),
    session.removeItem("session"),
  ]);
  assert.equal(await session.getItem("session"), null);
});

test("Supabase restores a migrated session, notifies listeners and clears it on sign out", async () => {
  const { storage, secure, session } = setup();
  const storedSession = {
    access_token: "test-access-token",
    refresh_token: "test-refresh-token",
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    expires_in: 3600,
    token_type: "bearer",
    user: { id: "test-user" },
  };
  await storage.setItem("test-session", JSON.stringify(storedSession));

  const client = createClient("http://localhost:54321", "test-anon-key", {
    auth: {
      storageKey: "test-session",
      storage: session,
      persistSession: true,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: { fetch: async () => new Response(null, { status: 204 }) },
  });
  const events = [];
  const { data: subscription } = client.auth.onAuthStateChange((event) => {
    events.push(event);
  });

  try {
    const { data, error } = await client.auth.getSession();
    assert.equal(error, null);
    assert.equal(data.session?.user.id, "test-user");
    assert.equal(await storage.getItem("test-session"), null);
    assert.ok(await storage.getItem("test-session.encrypted"));
    const signOut = await client.auth.signOut();
    assert.equal(signOut.error, null);
    assert.ok(events.includes("SIGNED_OUT"));
    assert.equal(await storage.getItem("test-session.encrypted"), null);
    assert.equal(await secure.getItem("lappka.auth.key.test-session"), null);
  } finally {
    subscription.subscription.unsubscribe();
    await client.auth.dispose();
  }
});

test("session encoding preserves Unicode and rejects malformed bytes", () => {
  for (const value of ["", "Łappka 🐾", "\ud800", "x".repeat(10000)]) {
    assert.equal(decodeSession(encodeSession(value)), value);
  }
  assert.throws(
    () => decodeSession(new Uint8Array([0])),
    /Invalid encrypted session/,
  );
});
