// Mirrors lib/zazu/resources/beneficiaries.rb.
//
// Read-only directory of saved transfer recipients. Each beneficiary
// embeds its bank accounts; the one flagged `default` is used when a
// transfer names only the beneficiary_id. Beneficiaries are created
// and managed in the Zazu dashboard.

import type { Page } from "../page.js";
import type { ZazuResponse } from "../response.js";
import { type ListParams, ResourceBase } from "./base.js";

export class Beneficiaries extends ResourceBase {
  list(params: ListParams = {}): Promise<Page<unknown>> {
    const { limit, cursor } = params;
    return this.listPage("api/beneficiaries", {}, { limit, cursor });
  }

  get(id: string): Promise<ZazuResponse> {
    return this.httpGet(this.encodePath("api/beneficiaries", id));
  }
}
