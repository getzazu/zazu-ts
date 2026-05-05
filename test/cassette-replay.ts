// Reads VCR YAML cassettes (recorded by zazu-ruby) and registers them
// as msw HTTP handlers so identical interactions replay against this
// SDK. The contract is enforced cross-language: every SDK that
// consumes this tarball must replay the exact request shape.

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import yaml from "js-yaml";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

interface CassetteInteraction {
  request: {
    method: string;
    uri: string;
    body: { string: string };
    headers?: Record<string, string[]>;
  };
  response: {
    status: { code: number; message: string };
    headers: Record<string, string[]>;
    body: { string: string };
  };
}

interface Cassette {
  http_interactions: CassetteInteraction[];
}

export async function loadCassette(name: string): Promise<CassetteInteraction[]> {
  const path = join(import.meta.dir, "fixtures/cassettes", `${name}.yml`);
  const raw = await readFile(path, "utf8");
  const parsed = yaml.load(raw) as Cassette;
  return parsed.http_interactions;
}

export function cassetteHandler(interaction: CassetteInteraction) {
  const { method, uri } = interaction.request;
  const verb = method.toLowerCase() as "get" | "post" | "patch" | "delete" | "put";
  const responseHeaders: Record<string, string> = {};
  for (const [k, v] of Object.entries(interaction.response.headers)) {
    if (Array.isArray(v) && v.length > 0) responseHeaders[k] = v[0]!;
  }

  return http[verb](uri, () =>
    HttpResponse.text(interaction.response.body.string, {
      status: interaction.response.status.code,
      headers: responseHeaders,
    }),
  );
}

export async function startServer(cassetteNames: string[]): Promise<ReturnType<typeof setupServer>> {
  const handlers = [];
  for (const name of cassetteNames) {
    const interactions = await loadCassette(name);
    for (const i of interactions) handlers.push(cassetteHandler(i));
  }
  const server = setupServer(...handlers);
  server.listen({ onUnhandledRequest: "error" });
  return server;
}
