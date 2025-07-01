import { configDefaults, defineConfig } from 'vitest/config';
import { getDirname } from '../../scripts/getDirname.js';

export default defineConfig({
  plugins: [],
  resolve: {
    alias: {
      '@hyperse/logger': getDirname(import.meta.url, '../logger/src/index.ts'),
      '@hyperse/logger-common': getDirname(
        import.meta.url,
        '../../logger-common/src/index.ts'
      ),
    },
  },
  test: {
    globals: true,
    exclude: [...configDefaults.exclude],
    include: ['**/?(*.){test,spec}.?(c|m)[jt]s?(x)'],
  },
});
