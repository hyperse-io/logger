import nextra from 'nextra';
import { z } from 'zod/v4';
import { createNextConfig, createNextConfigEnv } from '@hyperse/next-config';

const withNextra = nextra({
  latex: true,
  defaultShowCopyCode: true,
  search: {
    codeblocks: false,
  },
  mdxOptions: {
    remarkPlugins: [],
  },
});

// We use a custom env to validate the build env
const buildEnv = createNextConfigEnv(
  z.object({
    NEXT_BUILD_ENV_OUTPUT: z
      .union([z.literal('standalone'), z.literal('export')])
      .optional(),
  })
);

export default createNextConfig(
  {
    basePath: '/logger',
    output: buildEnv.NEXT_BUILD_ENV_OUTPUT,
    images: {
      unoptimized:
        buildEnv.NEXT_BUILD_ENV_OUTPUT === 'export' ? true : undefined,
    },
  },
  [withNextra]
);
