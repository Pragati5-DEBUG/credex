import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const src = path.join(repoRoot, "web", ".next");
const dest = path.join(repoRoot, ".next");

if (!fs.existsSync(src)) {
  console.error(`Missing ${src}; web build may have failed.`);
  process.exit(1);
}

fs.rmSync(dest, { recursive: true, force: true });

if (process.env.VERCEL === "1" || process.platform !== "win32") {
  fs.symlinkSync(src, dest, "dir");
  console.log(`Linked ${dest} -> ${src}`);
} else {
  fs.cpSync(src, dest, { recursive: true });
  console.log(`Copied ${src} to ${dest}`);
}
