// Mirrors lib/zazu/resources/webhook_endpoints.rb.

import type { Page } from "../page.js";
import type { ZazuResponse } from "../response.js";
import { ResourceBase, type ListParams } from "./base.js";

export interface WebhookEndpointCreateParams {
  url: string;
  events: string[];
  description?: string;
}

export class WebhookEndpoints extends ResourceBase {
  list(params: ListParams = {}): Promise<Page<unknown>> {
    const { limit, cursor } = params;
    return this.listPage("api/webhook_endpoints", {}, { limit, cursor });
  }

  get(id: string): Promise<ZazuResponse> {
    return this.httpGet(this.encodePath("api/webhook_endpoints", id));
  }

  create(params: WebhookEndpointCreateParams): Promise<ZazuResponse> {
    return this.httpPost("api/webhook_endpoints", params);
  }

  update(id: string, attributes: Record<string, unknown>): Promise<ZazuResponse> {
    return this.httpPatch(this.encodePath("api/webhook_endpoints", id), attributes);
  }

  delete(id: string): Promise<ZazuResponse> {
    return this.httpDelete(this.encodePath("api/webhook_endpoints", id));
  }

  test(id: string): Promise<ZazuResponse> {
    return this.httpPost(this.encodePath("api/webhook_endpoints", id, "test"));
  }

  regenerateSecret(id: string): Promise<ZazuResponse> {
    return this.httpPost(this.encodePath("api/webhook_endpoints", id, "regenerate_secret"));
  }

  enable(id: string): Promise<ZazuResponse> {
    return this.httpPost(this.encodePath("api/webhook_endpoints", id, "enable"));
  }

  disable(id: string): Promise<ZazuResponse> {
    return this.httpPost(this.encodePath("api/webhook_endpoints", id, "disable"));
  }
}
