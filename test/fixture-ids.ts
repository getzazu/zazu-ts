// Mirror of spec/support/fixture_ids.rb in zazu-ruby. The placeholders
// here must exactly match what VCR scrubbed the real staging UUIDs to
// when the cassettes were recorded — otherwise the request URI won't
// match and msw rejects with "no handler".

export const FIXTURE_IDS = {
  ZAZU_FIXTURE_ACCOUNT_ID: "fixture-account-id",
  ZAZU_FIXTURE_TRANSACTION_ID: "fixture-transaction-id",
  ZAZU_FIXTURE_CUSTOMER_ID: "fixture-customer-id",
  ZAZU_FIXTURE_DELETABLE_CUSTOMER_ID: "fixture-deletable-customer-id",
  ZAZU_FIXTURE_INVOICE_ID: "fixture-invoice-id",
  ZAZU_FIXTURE_DELETABLE_INVOICE_ID: "fixture-deletable-invoice-id",
  ZAZU_FIXTURE_PAYMENT_LINK_ID: "fixture-payment-link-id",
  ZAZU_FIXTURE_CANCELLABLE_PAYMENT_LINK_ID: "fixture-cancellable-payment-link-id",
  ZAZU_FIXTURE_WEBHOOK_ID: "fixture-webhook-id",
  ZAZU_FIXTURE_ENABLED_WEBHOOK_ID: "fixture-enabled-webhook-id",
  ZAZU_FIXTURE_DISABLED_WEBHOOK_ID: "fixture-disabled-webhook-id",
  ZAZU_FIXTURE_DELETABLE_WEBHOOK_ID: "fixture-deletable-webhook-id",
} as const;

export const STAGING_BASE_URL = "https://staging.zazu.ma";
export const TEST_API_KEY = "test-api-key-for-replay";
