import type { FC } from 'react';
import type { Metadata } from 'next';
import { HomeView } from './widgets/HomeView';

export const metadata: Metadata = {
  title: 'Hyperse Logger',
  description:
    'Hyperse Logger is a powerful logging library for Node.js with a plugin architecture. It is built on Hyperse Pipeline for efficient message processing.',
};

const IndexPage: FC = () => {
  return (
    <section className="container mx-auto max-w-7xl">
      <HomeView />
    </section>
  );
};

export default IndexPage;
