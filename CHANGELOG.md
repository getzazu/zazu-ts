# Changelog

All notable changes to `@getzazu/sdk` are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `checkoutSessions` resource — `create` and `get` mirror `Zazu::Resources::CheckoutSessions` in zazu-ruby v0.2.0

## [0.1.0]

Initial release.

### Added

- Runtime-agnostic `Zazu` client built on native `fetch`
- Resource modules: `accounts`, `customers`, `entity`, `invoices`, `paymentLinks`, `webhookEndpoints`
- Cursor-based `Page<T>` with async iterator
- Nine-class error hierarchy mirroring `zazu-ruby`
- Cassette-replay test harness driven by the Ruby SDK's release tarball
