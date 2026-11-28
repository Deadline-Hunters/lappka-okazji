import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { createClient } from "@supabase/supabase-js";

const cli = fileURLToPath(
  new URL("../../node_modules/.bin/supabase", import.meta.url),
);
const status = execFileSync(cli, ["status", "--output", "env"], {
  encoding: "utf8",
  stdio: ["ignore", "pipe", "ignore"],
});
const config = Object.fromEntries(
  status
    .split("\n")
    .map((line) => line.match(/^([A-Z_]+)="(.*)"$/))
    .filter(Boolean)
    .map((match) => [match[1], match[2]]),
);
const apiUrl = new URL(config.API_URL);
assert.ok(
  ["localhost", "127.0.0.1", "::1"].includes(apiUrl.hostname),
  "Registration tests must run against local Supabase",
);
assert.ok(config.ANON_KEY && config.SERVICE_ROLE_KEY, "Missing local API keys");

const authOptions = { persistSession: false, autoRefreshToken: false };
const admin = createClient(apiUrl.href, config.SERVICE_ROLE_KEY, {
  auth: authOptions,
});

for (const metadata of [
  null,
  {
    first_name: "Anna",
    last_name: "Nowak",
    username: `test_${randomUUID().replaceAll("-", "").slice(0, 20)}`,
  },
]) {
  test(`sign-up creates a profile ${metadata ? "with metadata" : "with defaults"}`, async (t) => {
    const client = createClient(apiUrl.href, config.ANON_KEY, {
      auth: authOptions,
    });
    const { data, error } = await client.auth.signUp({
      email: `kan47-${randomUUID()}@example.com`,
      password: `Test-${randomUUID()}!`,
      ...(metadata ? { options: { data: metadata } } : {}),
    });
    assert.ifError(error);
    assert.ok(data.user, "Sign-up did not return a user");
    const userId = data.user.id;
    t.after(async () => {
      const { error: deleteError } = await admin.auth.admin.deleteUser(userId);
      assert.ifError(deleteError);
    });
    assert.equal(data.session, null, "Email confirmation should be required");
    assert.equal(data.user.email_confirmed_at, undefined);

    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select(
        "id, first_name, last_name, username, lappsy_balance, is_verified",
      )
      .eq("id", userId)
      .single();
    assert.ifError(profileError);
    assert.equal(profile.id, userId);
    assert.equal(profile.lappsy_balance, 0);
    assert.equal(profile.is_verified, false);
    assert.equal(profile.first_name, metadata?.first_name ?? null);
    assert.equal(profile.last_name, metadata?.last_name ?? null);
    if (metadata) {
      assert.equal(profile.username, metadata.username);
    } else {
      assert.match(profile.username, /^u_[0-9a-v]{26}$/);
    }
  });
}

test("a seeded account can sign in", async () => {
  const client = createClient(apiUrl.href, config.ANON_KEY, {
    auth: authOptions,
  });
  const { data, error } = await client.auth.signInWithPassword({
    email: "kamil.seed@example.com",
    password: "password",
  });
  assert.ifError(error);
  assert.ok(data.session);
});
