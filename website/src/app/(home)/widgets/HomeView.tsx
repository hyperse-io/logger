'use client';

import type { FC } from 'react';
import { Link } from 'nextra-theme-docs';
import { Feature, Features } from '@/components/Features';
import { Icon } from '@iconify/react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import styles from './page.module.css';
import './page.css';

const features = [
  {
    title: 'Plugin Architecture',
    icon: 'material-icon-theme:architecture',
    description: 'Extensible logging through a powerful plugin system',
  },
  {
    title: 'Multiple Log Levels',
    icon: 'emojione:level-slider',
    description: 'Support for Error, Warn, Info, Debug, and Verbose levels',
  },
  {
    title: 'Pipeline Processing',
    icon: 'material-icon-theme:pipeline',
    description: 'Built on Hyperse Pipeline for efficient message processing',
  },
  {
    title: 'Customizable Context',
    icon: 'material-icon-theme:folder-custom',
    description: 'Extend logger context with custom properties',
  },
  {
    title: 'TypeScript Support',
    icon: 'vscode-icons:file-type-typescript-official',
    description: 'Full TypeScript support with comprehensive type definitions',
  },
  {
    title: 'High Performance',
    icon: 'streamline-ultimate-color:performance-increase',
    description: 'Optimized for production use with minimal overhead',
  },
  {
    title: 'Flexible Configuration',
    icon: 'twemoji:flexed-biceps',
    description: 'Easy setup with sensible defaults',
  },
  {
    title: 'Async Support',
    icon: 'logos:async-api-icon',
    description: 'Built-in support for asynchronous operations',
  },
];

export const HomeView: FC = () => {
  return (
    <div className="mb-24">
      <div className="grid grid-cols-1 gap-12 px-4 py-24 md:grid-cols-5 md:py-32">
        <div className="flex flex-col items-center justify-evenly gap-4 md:col-span-3 md:items-start md:pr-12">
          <div className="text-center text-4xl font-bold md:text-left md:text-5xl lg:text-6xl">
            <h1 className="mb-2 bg-gradient-to-r from-black to-gray-500 bg-clip-text py-1 text-transparent dark:from-blue-300 dark:to-blue-500">
              Logger
            </h1>
            A powerful, pluggable, and flexible type-safe logger for modern
            applications.
          </div>
          <p className="subtitle mt- w-fit md:w-auto">
            <Link className={styles.cta} href="/docs">
              Get started <span>→</span>
            </Link>
          </p>
        </div>
        <div
          className={`${styles.right_layout} order-first hidden md:order-none md:col-span-2 md:block`}
        >
          <div className={`${styles.image_bg} hidden dark:block`} />
          <DotLottieReact
            src="/logger/assets/lottie/niu.lottie"
            loop
            autoplay
          />
        </div>
      </div>
      <div className="px-4">
        <Features>
          {features.map((feature, index) => (
            <Feature
              key={index}
              index={index}
              id="highlighting-card"
              className="space-y-4"
            >
              <div className="flex size-10 items-center justify-center rounded-sm bg-transparent dark:bg-slate-500/10">
                <Icon icon={feature.icon} className="size-6 text-white" />
              </div>
              <h4 className="flex items-center gap-2 text-xl font-bold">
                {feature.title}
              </h4>
              <p className="text-md text-gray-500">{feature.description}</p>
            </Feature>
          ))}
        </Features>
      </div>
    </div>
  );
};
