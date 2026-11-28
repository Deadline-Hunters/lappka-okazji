import assert from "node:assert/strict";
import test from "node:test";

import {
  appStorageKeys,
  authStorageKeys,
  clearApplicationSession,
  clearLocalApplicationData,
  createMarkedSessionStorage,
  LOGOUT_PENDING_KEY,
  resetLocalSession,
  SESSION_OWNER_KEY,
  withoutCleanupMarkers,
} from "./logout.ts";

function setup() {
  const calls = [];
  return {
    calls,
    dependencies: {
      markPending: async () => calls.push("markPending"),
      signOut: async () => {
        calls.push("signOut");
        return { error: null };
      },
      getSession: async () => {
        calls.push("getSession");
        return { data: { session: null }, error: null };
      },
      clearLocalData: async () => calls.push("clearLocalData"),
    },
  };
}

test("clears the whole local store after sign-out and pending writes", async () => {
  const { calls, dependencies } = setup();
  assert.deepEqual(await clearApplicationSession(dependencies), {
    serverSignOutFailed: false,
  });
  assert.deepEqual(calls, ["markPending", "signOut", "clearLocalData"]);
});

test("records session ownership before storing an authentication session", async () => {
  const calls = [];
  const storage = createMarkedSessionStorage(
    {
      getItem: async () => null,
      setItem: async (key) => calls.push(key),
      removeItem: async () => {},
    },
    async () => calls.push("marker"),
  );
  await storage.setItem("sb-test-auth-token", "session");
  await storage.setItem("sb-test-auth-token-code-verifier", "verifier");
  assert.deepEqual(calls, [
    "marker",
    "sb-test-auth-token",
    "sb-test-auth-token-code-verifier",
  ]);
});

test("does not save a session if its recovery marker cannot be written", async () => {
  let saved = false;
  const storage = createMarkedSessionStorage(
    {
      getItem: async () => null,
      setItem: async () => {
        saved = true;
      },
      removeItem: async () => {},
    },
    async () => {
      throw new Error("storage unavailable");
    },
  );
  await assert.rejects(storage.setItem("sb-test-auth-token", "session"));
  assert.equal(saved, false);
});

test("reports a server failure when the local session was removed", async () => {
  const { calls, dependencies } = setup();
  dependencies.signOut = async () => {
    calls.push("signOut");
    return { error: new Error("offline") };
  };
  assert.deepEqual(await clearApplicationSession(dependencies), {
    serverSignOutFailed: true,
  });
  assert.deepEqual(calls, [
    "markPending",
    "signOut",
    "getSession",
    "clearLocalData",
  ]);
});

test("does not clear local data while authentication session still exists", async () => {
  const { calls, dependencies } = setup();
  dependencies.signOut = async () => ({ error: new Error("offline") });
  dependencies.getSession = async () => ({
    data: { session: { user: { id: "test" } } },
    error: null,
  });
  await assert.rejects(clearApplicationSession(dependencies));
  assert.deepEqual(calls, ["markPending"]);
});

test("propagates storage errors for a retry", async () => {
  const { dependencies } = setup();
  dependencies.clearLocalData = async () => {
    throw new Error("storage unavailable");
  };
  await assert.rejects(clearApplicationSession(dependencies), /unavailable/);
});

test("keeps the recovery marker when clearing storage fails", async () => {
  const calls = [];
  await assert.rejects(
    clearLocalApplicationData({
      waitForWrites: async () => calls.push("wait"),
      clearStorage: async () => {
        calls.push("clear");
        throw new Error("storage unavailable");
      },
      clearMarkers: async () => calls.push("markers"),
    }),
    /storage unavailable/,
  );
  assert.deepEqual(calls, ["wait", "clear"]);
});

test("removes recovery markers only after all local data has been cleared", async () => {
  const calls = [];
  await clearLocalApplicationData({
    waitForWrites: async () => calls.push("wait"),
    clearStorage: async () => calls.push("clear"),
    clearMarkers: async () => calls.push("markers"),
  });
  assert.deepEqual(calls, ["wait", "clear", "markers"]);
  assert.deepEqual(
    withoutCleanupMarkers([SESSION_OWNER_KEY, "some-key", LOGOUT_PENDING_KEY]),
    ["some-key"],
  );
});

test("web cleanup selects application-owned data, not unrelated origin data", () => {
  assert.deepEqual(
    appStorageKeys([
      "lappka.preferences.v1",
      "lappka:auth:guest",
      "other-app",
      "lappka-other-app",
    ]),
    ["lappka.preferences.v1", "lappka:auth:guest"],
  );
});

test("reset marks pending before removing the session and local data", async () => {
  const calls = [];
  await resetLocalSession({
    markPending: async () => calls.push("mark"),
    clearStoredSession: async () => calls.push("session"),
    clearLocalData: async () => calls.push("data"),
  });
  assert.deepEqual(calls, ["mark", "session", "data"]);
});

test("reset stops and remains retryable when session removal fails", async () => {
  const calls = [];
  await assert.rejects(
    resetLocalSession({
      markPending: async () => calls.push("mark"),
      clearStoredSession: async () => {
        calls.push("session");
        throw new Error("storage unavailable");
      },
      clearLocalData: async () => calls.push("data"),
    }),
    /storage unavailable/,
  );
  assert.deepEqual(calls, ["mark", "session"]);
});

test("reset selects only this project's session and associated auth keys", () => {
  assert.deepEqual(
    authStorageKeys(
      [
        "sb-test-auth-token.encrypted",
        "sb-test-auth-token-code-verifier.encrypted",
        "sb-test-auth-token-flow-123-code-verifier",
        "sb-other-auth-token.encrypted",
        "other-data",
      ],
      "sb-test-auth-token",
    ),
    [
      "sb-test-auth-token",
      "sb-test-auth-token-code-verifier",
      "sb-test-auth-token-flow-123-code-verifier",
    ],
  );
});
