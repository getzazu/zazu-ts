// Downloads the cassette tarball published by zazu-ruby's release
// workflow. CI calls this before running tests so we don't have to
// commit cassettes into both repos.
//
//   bun scripts/fetch-cassettes.ts            # latest release
//   bun scripts/fetch-cassettes.ts v0.1.3      # specific tag
//
// Cassettes land under test/fixtures/cassettes/.

import { mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { x as extractTar } from "tar";

const REPO = "getzazu/zazu-ruby";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DEST = join(ROOT, "test/fixtures/cassettes");

const tag = process.argv[2] ?? (await latestTag());
const tarUrl = `https://github.com/${REPO}/releases/download/${tag}/cassettes-${tag}.tar.gz`;

console.log(`Fetching cassettes from ${tarUrl}`);

const headers: Record<string, string> = { Accept: "application/octet-stream" };
if (process.env.GH_TOKEN) headers.Authorization = `Bearer ${process.env.GH_TOKEN}`;

// GitHub's API weathers occasional 503 storms — retry rather than fail a CI run.
async function fetchWithRetry(url: string, init: RequestInit, attempts = 8): Promise<Response> {
  let last: Response | undefined;
  for (let i = 0; i < attempts; i++) {
    try {
      last = await fetch(url, init);
      if (last.ok) return last;
    } catch {
      // network error — fall through to retry
    }
    await new Promise((r) => setTimeout(r, 10_000));
  }
  if (last) return last;
  throw new Error(`fetch failed after ${attempts} attempts: ${url}`);
}

const res = await fetchWithRetry(tarUrl, { headers });
if (!res.ok) {
  console.error(`Failed: ${res.status} ${res.statusText} (set GH_TOKEN if zazu-ruby is private)`);
  process.exit(1);
}

const tarPath = join(tmpdir(), `zazu-cassettes-${tag}.tar.gz`);
const buf = new Uint8Array(await res.arrayBuffer());
await writeFile(tarPath, buf);

await mkdir(DEST, { recursive: true });
await extractTar({ file: tarPath, cwd: dirname(DEST), strip: 0 });

console.log(`Cassettes extracted to ${DEST}`);

async function latestTag(): Promise<string> {
  // Resolve over the git transport rather than api.github.com — the REST
  // API's 503 storms have failed release runs, while the git endpoints
  // ride separate infrastructure.
  const proc = Bun.spawn([
    "git",
    "ls-remote",
    "--tags",
    "--refs",
    `https://github.com/${REPO}.git`,
    "v*",
  ]);
  const out = await new Response(proc.stdout).text();
  const tags = out
    .split("\n")
    .map((line) => line.split("/").pop() ?? "")
    .filter((tag) => /^v\d/.test(tag))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const latest = tags.at(-1);
  if (!latest) throw new Error(`Could not resolve latest tag for ${REPO}`);
  return latest;
}
