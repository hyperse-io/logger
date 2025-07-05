# @hyperse/logger

<p align="left">
  <a aria-label="Build" href="https://github.com/hyperse-io/logger/actions?query=workflow%3ACI">
    <img alt="build" src="https://img.shields.io/github/actions/workflow/status/hyperse-io/logger/ci-integrity.yml?branch=main&label=ci&logo=github&style=flat-quare&labelColor=000000" />
  </a>
  <a aria-label="stable version" href="https://www.npmjs.com/package/@hyperse/logger">
    <img alt="stable version" src="https://img.shields.io/npm/v/%40hyperse%2Flogger?branch=main&label=version&logo=npm&style=flat-quare&labelColor=000000" />
  </a>
  <a aria-label="Top language" href="https://github.com/hyperse-io/logger/search?l=typescript">
    <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/hyperse-io/logger?style=flat-square&labelColor=000&color=blue">
  </a>
  <a aria-label="License" href="https://github.com/hyperse-io/logger/blob/main/LICENSE">
    <img alt="License" src="https://img.shields.io/npm/l/%40hyperse%2Flogger?style=flat-square&labelColor=000">
  </a>
  <a aria-label="Node.js version" href="https://nodejs.org/">
    <img alt="Node.js version" src="https://img.shields.io/node/v/%40hyperse%2Flogger?style=flat-square&labelColor=000">
  </a>
</p>

A powerful, pluggable, and flexible type-safe logger for modern applications. Built with TypeScript and designed for extensibility through a plugin system.

## ✨ Features

- **🔌 Pluggable Architecture**: Extend functionality through a flexible plugin system
- **🛡️ Type Safety**: Full TypeScript support with advanced type inference
- **⚡ High Performance**: Lightweight core with efficient message processing
- **🎯 Multiple Log Levels**: Support for Error, Warn, Info, Debug, and Verbose levels
- **🔄 Pipeline Support**: Built-in pipeline for message transformation and processing
- **🎨 Flexible Messages**: Support for both string and structured message objects
- **🔧 Context-Aware**: Rich context system with type-safe plugin integration
- **🚀 Modern ES Modules**: Native ES module support
- **📦 Zero Dependencies**: Minimal core with optional plugin ecosystem

## 📦 Installation

```bash
npm install @hyperse/logger
# or
yarn add @hyperse/logger
# or
pnpm add @hyperse/logger
```

## 🚀 Quick Start

### Basic Usage

```typescript
import { createLogger, LogLevel } from '@hyperse/logger';

// Create a simple logger
const logger = createLogger({
  name: 'my-app',
  thresholdLevel: LogLevel.Info,
}).build();

// Log messages
logger.info('Application started');
logger.warn('This is a warning');
logger.error('Something went wrong');
```

### With Plugins

```typescript
import { createLogger, LogLevel } from '@hyperse/logger';
import { createConsolePlugin } from '@hyperse/logger-plugin-console';

// Create logger with console plugin
const logger = createLogger({
  name: 'my-app',
  thresholdLevel: LogLevel.Debug,
})
  .use(createConsolePlugin())
  .build();

logger.info('Hello, World!');
logger.debug('Debug information');
```

## 📚 Usage Guide

### Creating a Logger

```typescript
import { createLogger, LogLevel } from '@hyperse/logger';

const logger = createLogger({
  name: 'my-application',
  thresholdLevel: LogLevel.Info,
  // Add custom context
  environment: 'production',
  version: '1.0.0',
}).build();
```

### Log Levels

The logger supports five log levels (from highest to lowest priority):

```typescript
logger.error('Critical error occurred'); // Level 0 - Errors only
logger.warn('Warning message'); // Level 1 - Warnings
logger.info('General information'); // Level 2 - Info messages
logger.debug('Debug information'); // Level 3 - Debug details
logger.verbose('Verbose information'); // Level 4 - Verbose details
```

### Message Formats

#### String Messages

```typescript
logger.info('Simple string message');
```

#### Structured Messages

```typescript
logger.info({
  message: 'User login attempt',
  prefix: '[AUTH]',
  name: 'login',
});

logger.error({
  message: 'Database connection failed',
  name: 'database',
  stack: error.stack,
});
```

#### Function Messages (Context-Aware)

```typescript
logger.info((ctx) => ({
  message: 'Request processed',
  prefix: '[API]',
  environment: ctx.environment, // Access context
  version: ctx.version,
}));
```

### Plugin System

#### Creating Custom Plugins

```typescript
import { definePlugin } from '@hyperse/logger';

// Simple plugin
const customPlugin = definePlugin({
  pluginName: 'custom-plugin',
  execute({ ctx, level, message }) {
    console.log(`[${level}] ${message}`);
  },
});

// Plugin with context
interface DatabaseContext {
  dbUrl: string;
  connectionPool: number;
}

const dbPlugin = definePlugin<DatabaseContext>({
  pluginName: 'database',
  execute({ ctx, level, message, pipe }) {
    // Use pipeline for message transformation
    pipe(
      (ctx) => ctx,
      (msg) => `[DB] ${msg}`,
      (formattedMsg) => {
        console.log(formattedMsg);
        // Could also send to database
      }
    )(ctx);
  },
});
```

#### Using Multiple Plugins

```typescript
const logger = createLogger({
  name: 'my-app',
  thresholdLevel: LogLevel.Info,
})
  .use(consolePlugin)
  .use(dbPlugin)
  .use(customPlugin)
  .build({
    dbUrl: 'postgresql://localhost:5432/mydb',
    connectionPool: 10,
  });
```

### Context and Type Safety

```typescript
// Define your application context
interface AppContext {
  userId: string;
  environment: string;
  version: string;
}

// Create logger with typed context
const logger = createLogger<AppContext>({
  name: 'my-app',
  thresholdLevel: LogLevel.Info,
  environment: 'production',
  version: '1.0.0',
})
  .use(consolePlugin)
  .build({
    userId: 'user123',
  });

// TypeScript will provide full type safety
logger.info((ctx) => ({
  message: 'User action',
  userId: ctx.userId, // ✅ Type-safe
  environment: ctx.environment, // ✅ Type-safe
  version: ctx.version, // ✅ Type-safe
}));
```

## 🔌 Available Plugins

### Official Plugins

- **[@hyperse/logger-plugin-console](https://github.com/hyperse-io/logger/tree/main/packages/logger-plugin-console)**: Rich console output with colors and formatting
- **[@hyperse/logger-plugin-stdout](https://github.com/hyperse-io/logger/tree/main/packages/logger-plugin-stdout)**: Standard output plugin for server environments
- **[@hyperse/logger-plugin-sentry](https://github.com/hyperse-io/logger/tree/main/packages/logger-plugin-sentry)**: Sentry integration for error tracking

### Installing Plugins

```bash
npm install @hyperse/logger-plugin-console
npm install @hyperse/logger-plugin-stdout
npm install @hyperse/logger-plugin-sentry
```

### Using Console Plugin

```typescript
import { createConsolePlugin } from '@hyperse/logger-plugin-console';

const logger = createLogger({
  name: 'my-app',
  thresholdLevel: LogLevel.Info,
})
  .use(
    createConsolePlugin({
      showTimestamp: true,
      showLevelName: true,
      showPrefix: true,
      noColor: false,
    })
  )
  .build();
```

## 🛠️ API Reference

### `createLogger(options?)`

Creates a new logger builder instance.

#### Parameters

- `options` (optional): Logger configuration
  - `name`: Logger name (required)
  - `thresholdLevel`: Minimum log level to process (default: `LogLevel.Info`)
  - `errorHandling`: Custom error handler function
  - Additional context properties

#### Returns

A `LoggerBuilder` instance for chaining plugins and building the logger.

### `LoggerBuilder`

#### Methods

- `use(plugin)`: Add a plugin to the logger
- `build(context?)`: Build the final logger instance

### `Logger`

#### Methods

- `error(message)`: Log error messages
- `warn(message)`: Log warning messages
- `info(message)`: Log info messages
- `debug(message)`: Log debug messages
- `verbose(message)`: Log verbose messages

### `LogLevel`

Enum of available log levels:

- `LogLevel.Error` (0)
- `LogLevel.Warn` (1)
- `LogLevel.Info` (2)
- `LogLevel.Debug` (3)
- `LogLevel.Verbose` (4)

## 📖 Examples

### Web Application Logger

```typescript
import { createLogger, LogLevel } from '@hyperse/logger';
import { createConsolePlugin } from '@hyperse/logger-plugin-console';

interface WebAppContext {
  userId?: string;
  requestId?: string;
  userAgent?: string;
}

const logger = createLogger<WebAppContext>({
  name: 'web-app',
  thresholdLevel: LogLevel.Info,
  environment: process.env.NODE_ENV,
  version: process.env.APP_VERSION,
})
  .use(
    createConsolePlugin({
      showTimestamp: true,
      showLevelName: true,
    })
  )
  .build();

// In your request handler
logger.info((ctx) => ({
  message: 'Request received',
  prefix: '[HTTP]',
  userId: ctx.userId,
  requestId: ctx.requestId,
}));
```

### Database Logger

```typescript
import { createLogger, LogLevel } from '@hyperse/logger';

interface DatabaseContext {
  dbUrl: string;
  connectionPool: number;
  queryTime?: number;
}

const dbLogger = createLogger<DatabaseContext>({
  name: 'database',
  thresholdLevel: LogLevel.Debug,
  dbUrl: process.env.DATABASE_URL,
  connectionPool: 10,
})
  .use(dbPlugin)
  .build();

dbLogger.debug((ctx) => ({
  message: 'Query executed',
  prefix: '[DB]',
  queryTime: ctx.queryTime,
  connectionPool: ctx.connectionPool,
}));
```

### Error Handling

```typescript
const logger = createLogger({
  name: 'my-app',
  thresholdLevel: LogLevel.Info,
  errorHandling: (error) => {
    // Custom error handling logic
    console.error('Logger error:', error);
  },
}).build();

try {
  // Some operation that might fail
  throw new Error('Something went wrong');
} catch (error) {
  logger.error({
    message: 'Operation failed',
    stack: error.stack,
  });
}
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/hyperse-io/logger.git
cd logger

# Install dependencies
npm install

# Run tests
npm test

# Build the project
npm run build
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Related Projects

- [@hyperse/logger-plugin-console](https://github.com/hyperse-io/logger/tree/main/packages/logger-plugin-console) - Console output plugin
- [@hyperse/logger-plugin-stdout](https://github.com/hyperse-io/logger/tree/main/packages/logger-plugin-stdout) - Standard output plugin
- [@hyperse/logger-plugin-sentry](https://github.com/hyperse-io/logger/tree/main/packages/logger-plugin-sentry) - Sentry integration plugin

## 📞 Support

- 📖 [Documentation](https://github.com/hyperse-io/logger)
- 🐛 [Issue Tracker](https://github.com/hyperse-io/logger/issues)
- 💬 [Discussions](https://github.com/hyperse-io/logger/discussions)

---

Made with ❤️ by the [Hyperse](https://github.com/hyperse-io) team
