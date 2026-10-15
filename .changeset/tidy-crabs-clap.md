---
'@hyperse/logger': patch
'@hyperse/logger-plugin-console': patch
'@hyperse/logger-plugin-stdout': patch
'@hyperse/logger-plugin-sentry': patch
---

fix: support TypeScript 7 in the build toolchain

- remove `baseUrl` from `tsconfig` (removed in TypeScript 7) so packages compile again
- declare `vite` alongside `vitest` to satisfy Vitest's peer dependency
