// Mirrors lib/zazu/resources/payment_links.rb.

import type { Page } from "../page.js";
import type { ZazuResponse } from "../response.js";
import { ResourceBase, type ListParams } from "./base.js";

export class PaymentLinks extends ResourceBase {
  list(params: ListParams = {}): Promise<Page<unknown>> {
    const { limit, cursor } = params;
    return this.listPage("api/payment_links", {}, { limit, cursor });
  }

  get(id: string): Promise<ZazuResponse> {
    return this.httpGet(this.encodePath("api/payment_links", id));
  }

  create(attributes: Record<string, unknown>): Promise<ZazuResponse> {
    return this.httpPost("api/payment_links", attributes);
  }

  cancel(id: string): Promise<ZazuResponse> {
    return this.httpPost(this.encodePath("api/payment_links", id, "cancel"));
  }
}
