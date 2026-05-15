import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function ensureDeterministicRoutesManifest(nextDir) {
  const routesManifest = path.join(nextDir, "routes-manifest.json");
  const deterministicManifest = path.join(nextDir, "routes-manifest-deterministic.json");

  if (!fs.existsSync(routesManifest)) {
    console.error(`Missing ${routesManifest}; next build may have failed.`);
    process.exit(1);
  }

  fs.copyFileSync(routesManifest, deterministicManifest);
  console.log(`Wrote ${deterministicManifest} from routes-manifest.json`);
}

const isMain =
  process.argv[1] &&
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isMain) {
  ensureDeterministicRoutesManifest(path.join(process.cwd(), ".next"));
}
