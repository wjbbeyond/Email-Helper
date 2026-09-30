# Email-Helper

Personal-use Gemini prototype. Enter your own Google API key in the page. The key is kept only in memory; refreshing clears it. Never supply a shared service key. Images, email text and/or preferences are sent directly to Google. Page scripts can access the in-memory key. Public multi-user service deployment requires a separate authenticated backend with request, input and cost limits. This repository does not provide that backend.

## Develop and verify

Node 22.13+ LTS, 24 LTS, or 26+.

```sh
npm ci
npm run dev
npm run typecheck
npm test
npm run build
npm run preview
```

Tests use fake model responses and never call paid APIs. Tailwind CSS is compiled locally. Build output uses relative asset paths for static subdirectory hosting; publish only `dist/` when separately authorized. No deployment workflow is included.
