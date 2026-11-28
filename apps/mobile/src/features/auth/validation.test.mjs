import assert from "node:assert/strict";
import test from "node:test";

import { isValidEmail, isValidPassword } from "./validation.ts";

test("validates email addresses after trimming whitespace", () => {
  assert.equal(isValidEmail(" user@example.com "), true);
  for (const email of ["", "user", "user@example", "user @example.com"]) {
    assert.equal(isValidEmail(email), false, email);
  }
});

test("enforces the configured minimum password length", () => {
  assert.equal(isValidPassword("12345"), false);
  assert.equal(isValidPassword("123456"), true);
});
