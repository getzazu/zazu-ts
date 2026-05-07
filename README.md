# @getzazu/sdk

TypeScript SDK for the [Zazu API](https://zazu.ma). Runtime-agnostic — runs on Node 20+, Bun, Deno, browsers, and Cloudflare Workers using native `fetch`.

```bash
bun add @getzazu/sdk    # or npm / pnpm / yarn
```

## Quick start

```ts
import { Zazu } from "@getzazu/sdk";

const zazu = new Zazu({ apiKey: process.env.ZAZU_API_KEY });

const entity = await zazu.entity.get();
console.log(entity.body);

const customers = await zazu.customers.list({ q: "Acme" });
for (const c of customers.data) console.log(c);

// Walk every page lazily
for await (const customer of customers.records()) {
  console.log(customer);
}
```

Environment variables `ZAZU_API_KEY`, `ZAZU_BASE_URL`, `ZAZU_API_VERSION`, and `ZAZU_TIMEOUT_MS` are read by default (Node/Bun only — browsers must pass options explicitly).

## Resources

```ts
zazu.entity.get();

zazu.accounts.list({ currency_code: "MAD" });
zazu.accounts.get(accountId);
zazu.accounts.listTransactions(accountId);
zazu.accounts.getTransaction(accountId, transactionId);

zazu.customers.list({ q: "Acme" });
zazu.customers.get(id);
zazu.customers.create({ ... });
zazu.customers.update(id, { ... });
zazu.customers.delete(id);

zazu.invoices.list();
zazu.invoices.create({ ... });
// state-transition methods exist but the underlying public API is
// not yet wired up — see zazu/app issue #2174.

zazu.paymentLinks.list();
zazu.paymentLinks.create({ ... });
zazu.paymentLinks.cancel(id);

zazu.webhookEndpoints.list();
zazu.webhookEndpoints.create({ url, events: [...] });
zazu.webhookEndpoints.test(id);
zazu.webhookEndpoints.regenerateSecret(id);
zazu.webhookEndpoints.enable(id);
zazu.webhookEndpoints.disable(id);

zazu.checkoutSessions.create({ account_id, amount, success_url, cancel_url });
zazu.checkoutSessions.get(id);
```

## Errors

Nine concrete subclasses; discriminate with `instanceof`.

```ts
import { ZazuValidationError, ZazuRateLimitError, ZazuNotFoundError } from "@getzazu/sdk";

try {
  await zazu.customers.create({ ... });
} catch (e) {
  if (e instanceof ZazuValidationError) {
    console.error(e.param, e.body);
  } else if (e instanceof ZazuRateLimitError) {
    console.warn(`Retry after ${e.retryAfter}s`);
  } else if (e instanceof ZazuNotFoundError) {
    /* ... */
  } else {
    throw e;
  }
}
```

## Wire format

Response bodies are returned as-is from the API — `snake_case` keys, no auto-camelCasing. The same shape ships across every Zazu SDK (Ruby, TypeScript, Python, ...) so the cassette contract is one-to-one.

## Cassette-replay testing

Tests replay the canonical cassettes recorded by [zazu-ruby](https://github.com/getzazu/zazu-ruby). The cassettes are downloaded at CI time from the Ruby SDK's release tarball, parsed via `js-yaml`, and replayed with [msw](https://mswjs.io). Same interactions, same assertions, every language.

```bash
bun run fetch:cassettes
bun test
```

## Sibling SDKs

- [zazu-ruby](https://github.com/getzazu/zazu-ruby) — reference implementation (records the cassettes)
- zazu-python, zazu-php, zazu-go, zazu-crystal, zazu-elixir — coming up

## License

MIT
