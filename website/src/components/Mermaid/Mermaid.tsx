'use client';

import { type FC, useEffect, useId, useRef, useState } from 'react';

export type MermaidProps = {
  /** The Mermaid diagram source, injected by `remarkMdxMermaid`. */
  chart: string;
  /** Optional caption rendered below the diagram. */
  caption?: string;
};

/**
 * Client-side Mermaid renderer.
 *
 * `remarkMdxMermaid` rewrites ```mermaid fences into `<Mermaid chart="..." />`.
 * `mermaid` is imported lazily so it never runs on the server and is only
 * fetched on pages that actually contain a diagram.
 */
export const Mermaid: FC<MermaidProps> = ({ chart, caption }) => {
  const reactId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    void (async () => {
      try {
        const { default: mermaid } = await import('mermaid');
        // `useId` produces ids containing `:`, which breaks Mermaid selectors.
        const id = `mermaid-${reactId.replace(/[^a-z0-9]/gi, '')}`;

        mermaid.initialize({
          startOnLoad: false,
          theme: document.documentElement.classList.contains('dark')
            ? 'dark'
            : 'default',
          securityLevel: 'strict',
          fontFamily: 'inherit',
        });

        const { svg, bindFunctions } = await mermaid.render(id, chart.trim());
        if (cancelled) return;
        container.innerHTML = svg;
        bindFunctions?.(container);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : String(err));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [chart, reactId]);

  if (error) {
    return (
      <div className="my-4 rounded-lg border border-red-500/40 bg-red-500/5 p-4">
        <p className="text-sm font-medium text-red-600 dark:text-red-400">
          Failed to render Mermaid diagram
        </p>
        <pre className="text-fd-muted-foreground mt-2 overflow-x-auto text-xs">
          {error}
        </pre>
      </div>
    );
  }

  return (
    <figure className="my-6 flex flex-col items-center gap-2">
      <div
        ref={containerRef}
        className="w-full overflow-x-auto [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full"
        suppressHydrationWarning
      />
      {caption ? (
        <figcaption className="text-fd-muted-foreground text-sm">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
};
