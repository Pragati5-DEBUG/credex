import fs from "node:fs";
import path from "node:path";

const nextDir = path.join(process.cwd(), ".next");
const routesManifest = path.join(nextDir, "routes-manifest.json");
const deterministicManifest = path.join(nextDir, "routes-manifest-deterministic.json");

if (!fs.existsSync(routesManifest)) {
  console.error(`Missing ${routesManifest}; next build may have failed.`);
  process.exit(1);
}

if (!fs.existsSync(deterministicManifest)) {
  fs.copyFileSync(routesManifest, deterministicManifest);
  console.log(`Created ${deterministicManifest} from routes-manifest.json`);
}
