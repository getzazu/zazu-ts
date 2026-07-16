// Mirror of spec/zazu/resources/beneficiaries_spec.rb.

import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { Page, Zazu } from "../../src/index.js";
import { startServer } from "../cassette-replay.js";
import { FIXTURE_IDS, STAGING_BASE_URL, TEST_API_KEY } from "../fixture-ids.js";

const CASSETTES = ["beneficiaries/list", "beneficiaries/get"];

describe("Beneficiaries (cassette replay)", () => {
  let server: Awaited<ReturnType<typeof startServer>>;
  let zazu: Zazu;

  beforeAll(async () => {
    server = await startServer(CASSETTES);
    zazu = new Zazu({ apiKey: TEST_API_KEY, baseUrl: STAGING_BASE_URL });
  });

  afterAll(() => server.close());

  test("#list returns a Page of beneficiaries with their bank accounts", async () => {
    const page = await zazu.beneficiaries.list();

    expect(page).toBeInstanceOf(Page);
    const first = page.data[0] as { external_accounts: unknown };
    expect(Array.isArray(first.external_accounts)).toBe(true);
  });

  test("#get returns a single beneficiary", async () => {
    const response = await zazu.beneficiaries.get(FIXTURE_IDS.ZAZU_FIXTURE_BENEFICIARY_ID);

    const body = response.body as { id: unknown; external_accounts: unknown };
    expect(typeof body.id).toBe("string");
    expect(Array.isArray(body.external_accounts)).toBe(true);
  });
});
