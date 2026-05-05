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

const res = await fetch(tarUrl, { headers });
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
  const ghHeaders: Record<string, string> = { Accept: "application/vnd.github+json" };
  if (process.env.GH_TOKEN) ghHeaders.Authorization = `Bearer ${process.env.GH_TOKEN}`;

  // /releases/latest skips prereleases and 404s on private repos for
  // unauthenticated callers — fall back to /releases (most-recent first)
  // which works in both cases.
  const r = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=1`, {
    headers: ghHeaders,
  });
  if (!r.ok) throw new Error(`Failed to query latest release: ${r.status} ${r.statusText}`);
  const arr = (await r.json()) as Array<{ tag_name: string; draft: boolean }>;
  const release = arr.find((rel) => !rel.draft);
  if (!release) throw new Error(`No published releases found for ${REPO}`);
  return release.tag_name;
}
