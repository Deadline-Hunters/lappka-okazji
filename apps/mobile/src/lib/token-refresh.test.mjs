import assert from "node:assert/strict";
import test from "node:test";

import { createTokenRefreshController } from "./token-refresh.ts";

test("serializes foreground, background and cleanup transitions", async () => {
  const calls = [];
  const controller = createTokenRefreshController(
    {
      async startAutoRefresh() {
        await new Promise((resolve) => setTimeout(resolve, 5));
        calls.push("start");
      },
      async stopAutoRefresh() {
        calls.push("stop");
      },
    },
    () => assert.fail("unexpected refresh error"),
  );
  await Promise.all([
    controller.update("active"),
    controller.update("background"),
    controller.update("active"),
    controller.update(null),
  ]);
  assert.deepEqual(calls, ["start", "stop", "start", "stop"]);
});

test("reports a refresh failure and continues processing state changes", async () => {
  const calls = [];
  const controller = createTokenRefreshController(
    {
      async startAutoRefresh() {
        throw new Error("failed");
      },
      async stopAutoRefresh() {
        calls.push("stop");
      },
    },
    () => calls.push("error"),
  );
  await controller.update("active");
  await controller.update("background");
  assert.deepEqual(calls, ["error", "stop"]);
});
