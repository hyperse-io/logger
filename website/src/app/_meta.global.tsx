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
  about: {
    type: 'page',
    theme: {
      typesetting: 'article',
    },
  },
};

export default meta;
