import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ensureDeterministicRoutesManifest } from "../web/scripts/ensure-vercel-manifest.mjs";

const repoRoot = process.cwd();
const src = path.join(repoRoot, "web", ".next");
const dest = path.join(repoRoot, ".next");

if (!fs.existsSync(src)) {
  console.error(`Missing ${src}; web build may have failed.`);
  process.exit(1);
}

ensureDeterministicRoutesManifest(src);

fs.rmSync(dest, { recursive: true, force: true });

if (process.env.VERCEL === "1") {
  fs.cpSync(src, dest, { recursive: true });
  console.log(`Copied ${src} to ${dest} for Vercel`);
} else if (process.platform !== "win32") {
  fs.symlinkSync(src, dest, "dir");
  console.log(`Linked ${dest} -> ${src}`);
} else {
  fs.cpSync(src, dest, { recursive: true });
  console.log(`Copied ${src} to ${dest}`);
}

ensureDeterministicRoutesManifest(dest);
