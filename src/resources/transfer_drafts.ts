// Mirrors lib/zazu/resources/transfer_drafts.rb.
//
// API-initiated transfers. Creating a draft routes it into the
// workspace's in-app approval flow — the API never executes a transfer
// itself. Poll get() (status: requested → processing → completed /
// failed) or subscribe to the `transfer.executed` webhook.

import type { ZazuResponse } from "../response.js";
import { ResourceBase } from "./base.js";

export class TransferDrafts extends ResourceBase {
  create(attributes: Record<string, unknown>): Promise<ZazuResponse> {
    return this.httpPost("api/transfer_drafts", attributes);
  }

  get(id: string): Promise<ZazuResponse> {
    return this.httpGet(this.encodePath("api/transfer_drafts", id));
  }
}
