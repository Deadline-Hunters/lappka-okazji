import assert from "node:assert/strict";
import test from "node:test";

import {
  isValidEmail,
  isValidPassword,
  isValidRegistrationAge,
  isValidUsername,
} from "./validation.ts";

test("validates the supported registration age boundaries", () => {
  for (const age of ["13", "19", "20", "99", "100", "149", "150"]) {
    assert.equal(isValidRegistrationAge(age), true, age);
  }
  for (const age of ["", "12", "151", "013", "13.5", "-13", "abc"]) {
    assert.equal(isValidRegistrationAge(age), false, age);
  }
});

test("validates usernames against the database format", () => {
  for (const username of ["abc", "A_b.1", "a".repeat(30)]) {
    assert.equal(isValidUsername(username), true, username);
  }
  for (const username of ["ab", "a".repeat(31), "żaba", "a b", "a-b"]) {
    assert.equal(isValidUsername(username), false, username);
  }
});

test("validates email and minimum password length", () => {
  assert.equal(isValidEmail(" user@example.com "), true);
  for (const email of ["", "user", "user@example", "user @example.com"]) {
    assert.equal(isValidEmail(email), false, email);
  }
  assert.equal(isValidPassword("12345"), false);
  assert.equal(isValidPassword("123456"), true);
});
