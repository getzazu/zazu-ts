// Downloads the cassette tarball published by zazu-ruby's release
// workflow. CI calls this before running tests so we don't have to
// commit cassettes into both repos.
//
//   bun scripts/fetch-cassettes.ts            # latest release
//   bun scripts/fetch-cassettes.ts v0.1.3      # specific tag
//
// Cassettes land under test/fixtures/cassettes/.

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { x as extractTar } from "tar";

const REPO = "getzazu/zazu-ruby";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DEST = join(ROOT, "test/fixtures/cassettes");

const tag = process.argv[2] ?? (await latestTag());
const tarUrl = `https://github.com/${REPO}/releases/download/${tag}/cassettes-${tag}.tar.gz`;

console.log(`Fetching cassettes from ${tarUrl}`);

const res = await fetch(tarUrl);
if (!res.ok) {
  console.error(`Failed: ${res.status} ${res.statusText}`);
  process.exit(1);
}

const tarPath = join(ROOT, "cassettes.tar.gz");
const buf = new Uint8Array(await res.arrayBuffer());
await writeFile(tarPath, buf);

await mkdir(DEST, { recursive: true });
await extractTar({ file: tarPath, cwd: dirname(DEST), strip: 0 });

console.log(`Cassettes extracted to ${DEST}`);

async function latestTag(): Promise<string> {
  const r = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!r.ok) throw new Error(`Failed to query latest release: ${r.status}`);
  const json = (await r.json()) as { tag_name: string };
  return json.tag_name;
}
