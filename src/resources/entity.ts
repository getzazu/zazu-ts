// Mirrors lib/zazu/resources/entity.rb.

import type { ZazuResponse } from "../response.js";
import { ResourceBase } from "./base.js";

export class Entity extends ResourceBase {
  get(): Promise<ZazuResponse> {
    return this.httpGet("api/entity");
  }
}
