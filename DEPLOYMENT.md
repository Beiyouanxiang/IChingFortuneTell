# Deployment Notes

## Supported First Release

The supported first public gray platform is one Aliyun Ubuntu application process behind Nginx. It is intentionally not a Sites deployment and not a PM2 cluster deployment.

Requirements:

- Node 22.13 or newer.
- Exactly one app process using `deploy/ecosystem.config.cjs`.
- Nginx using `deploy/nginx.iching.conf.example`.
- Provider secrets supplied through server environment variables only.
- Provider-console spending limits as an independent cost ceiling.

Start the single process with:

```bash
pm2 start deploy/ecosystem.config.cjs
pm2 save
```

Do not use `pm2 start -i`, `instances: "max"`, cluster mode, multiple containers, or multiple hosts with the bundled quota store.

## Environment

Copy values from `.env.example` into the server's secret environment without committing the resulting file. At minimum configure the provider allowlist, exact model ID, matching API key, API quotas, and:

```dotenv
TRUSTED_IP_HEADER=x-real-ip
```

Use `x-real-ip` only because the supplied Nginx configuration overwrites that header from `$remote_addr`. Do not trust forwarding headers on a directly exposed Node port.

## Request Size Defense

The application checks a declared `Content-Length` before reading and otherwise consumes the request stream incrementally. It cancels the stream as soon as accumulated bytes exceed `API_MAX_BODY_BYTES`.

The supplied Nginx server block adds a second layer:

```nginx
client_max_body_size 16k;
```

Keep the application default at 12 KB when using that Nginx value. After changing the Nginx configuration, run `nginx -t` before reloading it.

## Quota Boundary

Per-IP and global minute/day counters live in the single Node process. They reset whenever that process restarts or is replaced. They are useful gray-release controls, not durable billing guarantees.

Sites/Workers, PM2 cluster mode, multiple Node processes, multiple containers, or multiple hosts do not have a reliable global quota with this counter. Before using any of those topologies, replace it with a shared atomic store such as a transactional database or a platform-native durable counter. Provider-console spending limits remain required.

## Privacy And Safety

The default `仅本地` mode sends no interpretation request. Connected provider modes send the complete question and clarifications to the selected provider and may be subject to that provider's retention policy.

No API key may appear in browser code, Git, logs, or documentation. Server logs contain lengths, selected provider/model, latency, risk class, and token totals, but not the complete private question.

## Build And Local Verification

```bash
npm install
npm test
npx tsc --noEmit
npm run lint
npm run build
npm audit --omit=dev
npm run start -- --host 127.0.0.1 --port 4173
# In another shell, with SMOKE_BASE_URL matching the selected port:
SMOKE_BASE_URL=http://127.0.0.1:4173 npm run smoke:production
```

Do not publish a Sites version as part of this deployment path. Mainland China domain service should begin only after the required ICP filing is approved.
