// Mirrors lib/zazu/errors.rb. Nine concrete error classes plus the
// abstract base. Discriminate via `instanceof`, not string match.

export interface ZazuErrorOptions {
  status?: number;
  requestId?: string | null;
  type?: string | null;
  param?: string | null;
  body?: unknown;
}

export class ZazuError extends Error {
  readonly status: number | undefined;
  readonly requestId: string | null;
  readonly type: string | null;
  readonly param: string | null;
  readonly body: unknown;

  constructor(message: string, options: ZazuErrorOptions = {}) {
    super(message);
    this.name = new.target.name;
    this.status = options.status;
    this.requestId = options.requestId ?? null;
    this.type = options.type ?? null;
    this.param = options.param ?? null;
    this.body = options.body;
  }
}

export class ZazuConfigurationError extends ZazuError {}
export class ZazuConnectionError extends ZazuError {}
export class ZazuAuthenticationError extends ZazuError {}
export class ZazuForbiddenError extends ZazuError {}
export class ZazuNotFoundError extends ZazuError {}
export class ZazuValidationError extends ZazuError {}
export class ZazuRateLimitError extends ZazuError {
  readonly retryAfter: number | null;

  constructor(
    message: string,
    options: ZazuErrorOptions & { retryAfter?: number | null } = {},
  ) {
    super(message, options);
    this.retryAfter = options.retryAfter ?? null;
  }
}
export class ZazuServerError extends ZazuError {}
export class ZazuArgumentError extends ZazuError {}
