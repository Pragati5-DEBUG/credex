/**
 * Runs `next dev` and opens the browser to *this* server's URL (parsed from stdout).
 * Avoids opening an old Next instance on :3000 when a new dev binds to another port.
 */
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const webRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const child = spawn("npx", ["next", "dev"], {
  cwd: webRoot,
  shell: true,
  stdio: ["inherit", "pipe", "inherit"],
  env: { ...process.env },
});

let opened = false;
let stdoutBuf = "";
const localUrlRe = /(https?:\/\/(?:127\.0\.0\.1|localhost):\d+)/i;

function tryOpenFromLine(line) {
  if (opened) return;
  const m = line.match(localUrlRe);
  if (!m) return;
  const url = m[1];
  opened = true;
  import("open")
    .then(({ default: open }) => open(url))
    .catch(() => {});
}

child.stdout?.on("data", (chunk) => {
  const text = chunk.toString();
  process.stdout.write(chunk);
  stdoutBuf += text;
  const parts = stdoutBuf.split(/\r?\n/);
  stdoutBuf = parts.pop() ?? "";
  for (const line of parts) tryOpenFromLine(line);
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else {
    if (code !== 0 && code != null) {
      console.error(
        "\n[credex dev] Next.js exited. If you see “Another next dev server is already running”, " +
          "stop the old process (Ctrl+C in that terminal) or run: taskkill /PID <pid> /F\n" +
          "Then open the URL that terminal printed (usually http://localhost:3000).\n",
      );
    }
    process.exit(code ?? 0);
  }
});

process.on("SIGINT", () => child.kill("SIGINT"));
process.on("SIGTERM", () => child.kill("SIGTERM"));
