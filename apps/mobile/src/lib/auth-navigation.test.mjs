import assert from "node:assert/strict";
import test from "node:test";

import {
  createAuthReturnController,
  getReturnPath,
  getReturnRoute,
  hasAccount,
} from "./auth-navigation.ts";

test("only an authenticated session permits account actions", () => {
  assert.equal(hasAccount(null), false);
  assert.equal(hasAccount(undefined), false);
  assert.equal(hasAccount({ user: { id: "user" } }), true);
});

test("maps each supported route back to the correct tab", () => {
  const routes = {
    "/": "/(tabs)",
    "/deals": "/(tabs)/deals",
    "/coupons": "/(tabs)/coupons",
    "/profile": "/(tabs)/profile",
    "/preferences": "/(tabs)/preferences",
  };
  for (const [path, route] of Object.entries(routes)) {
    assert.equal(getReturnPath(path), path);
    assert.equal(getReturnRoute(path), route);
  }
});

test("rejects untrusted or malformed return destinations", () => {
  for (const path of [
    undefined,
    ["/profile"],
    "/auth",
    "//example.com",
    "https://example.com",
    "/profile?next=//example.com",
    "/not-a-route",
    "__proto__",
  ]) {
    assert.equal(getReturnPath(path), "/");
    assert.equal(getReturnRoute(path), "/(tabs)");
  }
});

test("returns to the existing screen after app-initiated login or guest cancellation", () => {
  const controller = createAuthReturnController();
  const calls = [];
  const router = {
    canGoBack: () => true,
    back: () => calls.push("back"),
    replace: (route) => calls.push(route),
  };
  controller.markOpened();
  controller.returnFromAuth(router, "/deals");
  controller.markOpened();
  controller.returnFromAuth(router, "/profile");
  assert.deepEqual(calls, ["back", "back"]);
});

test("uses a validated replacement for deep links, missing history or cleared state", () => {
  const controller = createAuthReturnController();
  const calls = [];
  const router = {
    canGoBack: () => false,
    back: () => calls.push("back"),
    replace: (route) => calls.push(route),
  };
  controller.returnFromAuth(router, "/profile");
  controller.markOpened();
  controller.returnFromAuth(router, "/deals");
  controller.markOpened();
  controller.clear();
  controller.returnFromAuth(
    { ...router, canGoBack: () => true },
    "//example.com",
  );
  assert.deepEqual(calls, ["/(tabs)/profile", "/(tabs)/deals", "/(tabs)"]);
});
