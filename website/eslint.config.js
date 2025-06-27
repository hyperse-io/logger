import { defineConfig, nextjs } from '@hyperse/eslint-config-hyperse';

export default defineConfig(
  [
    ...nextjs,
    {
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-empty-object-type': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
    {
      files: ['**/*.mdx'],
      rules: {
        'no-undef': 'off',
      },
    },
  ],
  ['**/out']
);
