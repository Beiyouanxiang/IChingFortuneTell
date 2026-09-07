# IChingFortuneTell Implementation Plan

Last updated: 2026-09-07

## Product Source Of Truth

The formal product is the React/Vinext application:

- UI: `app/page.tsx`
- hexagram facts, casting, and risk classification: `lib/iching.js`
- provider interpretation and output validation: `lib/llm.js`
- API and abuse controls: `lib/api.js`, `lib/security.js`
- route entry: `app/api/interpret/route.ts`

The root static files remain only as a recoverable legacy compatibility version. They reuse the shared casting core and are not a second product truth.

## Product Boundary

The program is the only source of truth for the six lines, moving lines, primary hexagram, and changed hexagram. LLMs may interpret those facts but may not calculate, rename, or replace them.

The `phrase`, state, action, and avoidance fields are modern product-written summaries. They are not identified as received text, hexagram statements, or line statements. No unverified received text has been added.

## Completed Implementation

- Full fixed 64-entry King Wen number/name/pattern table.
- Three-coin 6/7/8/9 distribution of 1/8, 3/8, 3/8, 1/8.
- Three clarifying questions, topic detection, and bounded local history.
- React/plain-text rendering without `innerHTML` or raw model HTML.
- Same-origin structured interpretation API with GLM, DeepSeek, and Kimi adapters.
- Server-side fact recalculation, schema validation, and obvious output fact-conflict rejection.
- Default local-only mode and explicit third-party data disclosure.
- Provider allowlist, bounded streaming body reader, question/pattern validation, output-token cap, trusted-IP handling, and anonymous quotas.
- Safety-first handling for self-harm, medical, legal, and financial topics on both server and client fallback paths.
- Request cancellation and latest-request sequencing.
- Single-process Aliyun gray deployment examples with Nginx request-body enforcement.

## Compatibility Notes

The original implementation selected all four line kinds uniformly, producing moving lines about 50% of the time. The current three-coin implementation produces moving lines about 25% of the time.

The built-in quota state is process-local. It is suitable only for the documented single-process gray release, resets on restart, and is not a reliable global quota for Sites, PM2 cluster mode, or multiple instances.

## Verification

Run before release:

```bash
npm test
npx tsc --noEmit
npm run lint
npm run build
npm audit --omit=dev
```

The release also requires production HTTP smoke checks for the local-only page state, self-harm safety response, oversized request rejection, and no-provider local fallback.

## Latest Verified Result

On 2026-09-07 with Node 22.23.2:

- unit/integration tests: 26 passed, 0 failed;
- typecheck and lint: passed;
- production build: passed;
- production dependency audit: 0 vulnerabilities;
- production HTTP smoke: local-only visible, no-provider local fallback, self-harm safety branch, and oversized-body 413 all passed.

## External Inputs Still Required

- Exact production model IDs from the GLM, DeepSeek, and Kimi consoles.
- Provider privacy/retention policy links for provider-specific disclosure.
- A user-selected, citable received-text edition before adding any hexagram or line statements.
- A shared atomic quota store before any multi-instance or Sites production release.
