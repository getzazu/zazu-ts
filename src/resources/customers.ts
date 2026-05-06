// Mirrors lib/zazu/resources/customers.rb.

import type { Page } from "../page.js";
import type { ZazuResponse } from "../response.js";
import { type ListParams, ResourceBase } from "./base.js";

export interface CustomerListParams extends ListParams {
  q?: string;
}

export class Customers extends ResourceBase {
  list(params: CustomerListParams = {}): Promise<Page<unknown>> {
    const { limit, cursor, ...rest } = params;
    return this.listPage("api/customers", rest, { limit, cursor });
  }

  get(id: string): Promise<ZazuResponse> {
    return this.httpGet(this.encodePath("api/customers", id));
  }

  create(attributes: Record<string, unknown>): Promise<ZazuResponse> {
    return this.httpPost("api/customers", attributes);
  }

  update(id: string, attributes: Record<string, unknown>): Promise<ZazuResponse> {
    return this.httpPatch(this.encodePath("api/customers", id), attributes);
  }

  delete(id: string): Promise<ZazuResponse> {
    return this.httpDelete(this.encodePath("api/customers", id));
  }
}
