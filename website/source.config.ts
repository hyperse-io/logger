import { rehypeCodeDefaultOptions } from 'fumadocs-core/mdx-plugins';
import { remarkMdxMermaid } from 'fumadocs-core/mdx-plugins/remark-mdx-mermaid';
import { remarkNpm } from 'fumadocs-core/mdx-plugins/remark-npm';
import { remarkSteps } from 'fumadocs-core/mdx-plugins/remark-steps';
import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { transformerTwoslash } from 'fumadocs-twoslash';
import { remarkAutoTypeTable } from 'fumadocs-typescript';

export const docs = defineDocs({
  dir: 'content/docs',
});

export default defineConfig({
  mdxOptions: {
    // `remarkMdxMermaid` rewrites ```mermaid fences into `<Mermaid />`, which is
    // registered in `mdx-components.tsx`.
    remarkPlugins: [
      remarkAutoTypeTable,
      remarkSteps,
      remarkNpm,
      remarkMdxMermaid,
    ],
    rehypeCodeOptions: {
      ...rehypeCodeDefaultOptions,
      transformers: [
        ...(rehypeCodeDefaultOptions.transformers ?? []),
        transformerTwoslash({
          throws: false,
          twoslashOptions: {
            handbookOptions: {
              // These docs contain illustrative snippets that intentionally
              // reference undefined placeholders. `noErrors` suppresses the red
              // squiggle output entirely.
              //
              // Note: `noErrorValidation` alone is NOT enough — it only skips
              // the "expected errors must be annotated" check and still
              // renders diagnostics.
              noErrors: true,
              noErrorValidation: true,
            },
          },
          onTwoslashError: (error, code, lang) => {
            console.warn(
              `\n[twoslash] ${lang} FAILED:\n${String(
                (error as Error)?.message ?? error
              ).slice(0, 600)}\n`
            );
            return undefined;
          },
        }),
      ],
    },
  },
});
