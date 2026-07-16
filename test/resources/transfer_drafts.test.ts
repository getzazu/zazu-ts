// Mirror of spec/zazu/resources/transfer_drafts_spec.rb.

import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { Zazu } from "../../src/index.js";
import { startServer } from "../cassette-replay.js";
import { FIXTURE_IDS, STAGING_BASE_URL, TEST_API_KEY } from "../fixture-ids.js";

const CASSETTES = ["transfer_drafts/create", "transfer_drafts/get"];

describe("TransferDrafts (cassette replay)", () => {
  let server: Awaited<ReturnType<typeof startServer>> | undefined;
  let zazu: Zazu;

  beforeAll(async () => {
    server = await startServer(CASSETTES);
    zazu = new Zazu({ apiKey: TEST_API_KEY, baseUrl: STAGING_BASE_URL });
  });

  afterAll(() => server?.close());

  test("#create creates a draft awaiting in-app approval", async () => {
    const response = await zazu.transferDrafts.create({
      account_id: FIXTURE_IDS.ZAZU_FIXTURE_ACCOUNT_ID,
      beneficiary_id: FIXTURE_IDS.ZAZU_FIXTURE_BENEFICIARY_ID,
      amount: "150.00",
      payment_reference: "SDK fixture",
    });

    expect(response.status).toBe(201);
    const body = response.body as { status: string; transfer: unknown };
    expect(body.status).toBe("requested");
    expect(body.transfer).toBeNull();
  });

  test("#get returns a single transfer draft", async () => {
    const response = await zazu.transferDrafts.get(FIXTURE_IDS.ZAZU_FIXTURE_TRANSFER_DRAFT_ID);

    const body = response.body as { id: unknown; status: unknown };
    expect(typeof body.id).toBe("string");
    expect(typeof body.status).toBe("string");
  });
});
