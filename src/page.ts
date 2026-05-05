// Mirrors lib/zazu/page.rb. Cursor-based pagination wrapper.
//
// Hard cap on per-page size matches the Ruby SDK: callers cannot ask
// for more than MAX_PER_PAGE items in a single request.

import { ZazuArgumentError } from "./errors.js";
import type { ZazuResponse } from "./response.js";

export const MAX_PER_PAGE = 100;

export interface PageBody<T> {
  data: T[];
  has_more: boolean;
  next_cursor: string | null;
}

export type PageFetcher<T> = (cursor: string | null) => Promise<Page<T>>;

export class Page<T> {
  readonly data: T[];
  readonly hasMore: boolean;
  readonly nextCursor: string | null;
  readonly response: ZazuResponse<PageBody<T>>;
  readonly #fetcher: PageFetcher<T>;

  constructor(response: ZazuResponse<PageBody<T>>, fetcher: PageFetcher<T>) {
    const body = response.body;
    if (!body || !Array.isArray(body.data)) {
      throw new ZazuArgumentError(
        "Page response body has no `data` array — was this a list endpoint?",
        { body },
      );
    }
    this.response = response;
    this.data = body.data;
    this.hasMore = Boolean(body.has_more);
    this.nextCursor = body.next_cursor ?? null;
    this.#fetcher = fetcher;
  }

  async next(): Promise<Page<T> | null> {
    if (!this.hasMore || !this.nextCursor) return null;
    return this.#fetcher(this.nextCursor);
  }

  // Walks every page lazily. Caller decides when to stop.
  async *records(): AsyncIterableIterator<T> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let page: Page<T> | null = this;
    while (page) {
      for (const item of page.data) yield item;
      page = await page.next();
    }
  }
}
