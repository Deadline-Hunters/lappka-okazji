#!/usr/bin/env node

// Generates the Supabase TypeScript types for the mobile app.
//
// Usage:
//   node scripts/db-types.mjs           # write the types file
//   node scripts/db-types.mjs --check   # fail if the committed file is stale
//
// Uses the local Supabase database by default, so run `npm run supabase:start`
// first. Set SUPABASE_DB_URL to generate from another database.

import { spawnSync } from "node:child_process";
import {
  existsSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "prettier";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outputPath = join(root, "apps/mobile/src/lib/database.types.ts");
const outputName = relative(root, outputPath);
const check = process.argv.includes("--check");
const banner =
  "// WARN: DO NOT EDIT, FILE GENERATED WITH `npm run db:types`\n\n";

function generateTypes() {
  const args = ["gen", "types", "typescript", "--schema", "public"];
  if (process.env.SUPABASE_DB_URL) {
    args.push("--db-url", process.env.SUPABASE_DB_URL);
  } else {
    args.push("--local");
  }

  const localBin = join(
    root,
    "node_modules",
    ".bin",
    process.platform === "win32" ? "supabase.cmd" : "supabase",
  );
  const useLocalBin = process.platform !== "win32" && existsSync(localBin);
  const command = useLocalBin ? localBin : "npx";
  const commandArgs = useLocalBin ? args : ["supabase", ...args];

  const result = spawnSync(command, commandArgs, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
    // .cmd shims on Windows need a shell; POSIX can call the binary directly.
    shell: process.platform === "win32",
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.stderr.write(result.stderr ?? "");
    throw new Error(
      "supabase gen types failed. Start local Supabase with " +
        "`npm run supabase:start`, or set SUPABASE_DB_URL.",
    );
  }

  return result.stdout;
}

const config = (await prettier.resolveConfig(outputPath)) ?? {};
const generated = await prettier.format(banner + generateTypes(), {
  ...config,
  parser: "typescript",
  filepath: outputPath,
});

if (!generated.includes("export type Database")) {
  console.error(`No types generated; ${outputName} left unchanged.`);
  process.exit(1);
}

if (!check) {
  const tempPath = `${outputPath}.tmp`;
  try {
    writeFileSync(tempPath, generated);
    renameSync(tempPath, outputPath);
  } catch (error) {
    rmSync(tempPath, { force: true });
    throw error;
  }

  console.log(`Wrote ${outputName}`);
  process.exit(0);
}

const current = existsSync(outputPath) ? readFileSync(outputPath, "utf8") : "";

if (current === generated) {
  console.log("Database types are up to date.");
  process.exit(0);
}

console.error(
  `Database types are out of date. Run \`npm run db:types\` and commit ` +
    `${outputName}.`,
);

const currentLines = current.split("\n");
const generatedLines = generated.split("\n");
let line = 0;
while (
  line < currentLines.length &&
  line < generatedLines.length &&
  currentLines[line] === generatedLines[line]
) {
  line += 1;
}

console.error(`First difference at line ${line + 1}.`);
process.exit(1);
