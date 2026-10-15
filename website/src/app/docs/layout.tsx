import type { FC, ReactNode } from 'react';
import { Banner } from 'fumadocs-ui/components/banner';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/app/layout.config';
import { source } from '@/lib/source';

const DocsRootLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <Banner id="logger-published" variant="rainbow">
        🎉 Hyperse Logger has been published.
      </Banner>
      <DocsLayout
        tree={source.getPageTree()}
        {...baseOptions}
        sidebar={{ defaultOpenLevel: 1 }}
      >
        {children}
      </DocsLayout>
    </>
  );
};

export default DocsRootLayout;
