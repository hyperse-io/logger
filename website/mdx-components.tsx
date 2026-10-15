import { Popup, PopupContent, PopupTrigger } from 'fumadocs-twoslash/ui';
import { AutoTypeTable } from 'fumadocs-typescript/ui';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { Mermaid } from '@/components/Mermaid';
import { OverviewPage } from '@/components/OverviewPage';
import { generator } from '@/lib/generator';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Steps,
    Step,
    Popup,
    PopupContent,
    PopupTrigger,
    AutoTypeTable: (props: Record<string, unknown>) => (
      <AutoTypeTable {...props} generator={generator} />
    ),
    // Injected by `remarkMdxMermaid` for ```mermaid code fences.
    Mermaid,
    OverviewPage,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
