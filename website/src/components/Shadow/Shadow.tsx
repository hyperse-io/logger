'use client';

// https://gist.github.com/janily/04d7fb0861e053d4679b38743ffc05a7
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export const Shadow = ({
  mode,
  children,
  ...props
}: {
  mode: 'open' | 'closed';
  children: ReactNode;
}) => {
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null);
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!nodeRef.current || shadowRoot) return;

    try {
      const root = nodeRef.current.attachShadow({ mode });
      setShadowRoot(root);
    } catch (error) {
      console.warn('Failed to attach shadow root:', error);
    }
  }, [mode, shadowRoot]);

  return (
    <div {...props} ref={nodeRef}>
      {shadowRoot && createPortal(children, shadowRoot)}
    </div>
  );
};
