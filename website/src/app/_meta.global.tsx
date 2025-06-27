import type { MetaRecord } from 'nextra';

const meta: MetaRecord = {
  index: {
    type: 'page',
    display: 'hidden',
  },
  docs: {
    type: 'page',
    title: 'Documentation',
  },
  showcase: {
    type: 'page',
    theme: {
      typesetting: 'article',
      layout: 'full',
      timestamp: false,
      toc: false,
    },
  },
  about: {
    type: 'page',
    theme: {
      typesetting: 'article',
    },
  },
};

export default meta;
