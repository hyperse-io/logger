# @hyperse/logger-website

This is the official documentation website for the Hyperse Logger project, built with [Nextra](https://nextra.site) and [Next.js](https://nextjs.org/).

## Overview

The website uses MDX with [Twoslash](https://twoslash.netlify.app/) syntax for enhanced TypeScript code examples. This requires the packages in the monorepo to be compiled first to generate the necessary `.d.ts` files for type resolution.

## Prerequisites

- Node.js >= 18.0.0
- Yarn >= 1.22.0
- Access to the monorepo root directory

## Development Setup

### Step 1: Build Libraries

First, compile all packages in the monorepo to generate TypeScript declaration files:

```bash
yarn g:build
```

This command builds all workspace packages and generates the necessary `.d.ts` files that Twoslash uses for type resolution in the documentation.

### Step 2: Start Development Server

Start the local development server:

```bash
yarn dev
```

The website will be available at `http://localhost:3000`

### Step 3: Build for Production

Build the website for production deployment:

```bash
yarn build
```

For GitHub Pages deployment:

```bash
yarn build:ghpage
```

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn build:ghpage` - Build for GitHub Pages
- `yarn start` - Start production server
- `yarn lint` - Run ESLint
- `yarn test` - Run tests
- `yarn typecheck` - Run TypeScript type checking
