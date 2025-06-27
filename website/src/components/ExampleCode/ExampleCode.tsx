import type { FC } from 'react';
import { compileMdx } from 'nextra/compile';
import { MDXRemote } from 'nextra/mdx-remote';
import fs from 'node:fs/promises';
import path, { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ExampleCode: FC<{
  filePath: string;
  metadata: string;
  example: string;
}> = async ({ filePath, metadata, example }) => {
  const pageContent = await fs.readFile(
    join(
      dirname(fileURLToPath(import.meta.url)),
      '../../../examples',
      example,
      filePath
    ),
    'utf8'
  );
  const ext = path.extname(filePath).slice(1);

  const rawJs = await compileMdx(
    `~~~${ext} filename="${filePath}" showLineNumbers ${metadata}
${pageContent.trim()}
~~~`,
    { defaultShowCopyCode: true }
  );
  return <MDXRemote compiledSource={rawJs} />;
};
