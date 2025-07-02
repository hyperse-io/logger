<h1 align="center">Hyperse Logger</h1>

<div align="center">

  <a aria-label="Build" href="https://github.com/hyperse-io/logger/actions?query=workflow%3ACI">
    <img alt="build" src="https://img.shields.io/github/actions/workflow/status/hyperse-io/logger/ci-integrity.yml?branch=main&label=ci&logo=github&style=flat-quare&labelColor=000000" />
  </a>
  <a aria-label="stable version" href="https://www.npmjs.com/package/hyperse-io/logger">
    <img alt="stable version" src="https://img.shields.io/npm/v/%40hyperse%2Flogger?branch=main&label=version&logo=npm&style=flat-quare&labelColor=000000" />
  </a>
  <a aria-label="Top language" href="https://github.com/hyperse-io/logger/search?l=typescript">
    <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/hyperse-io/logger?style=flat-square&labelColor=000&color=blue">
  </a>
  <a aria-label="Licence" href="https://github.com/hyperse-io/logger/blob/main/LICENSE">
    <img alt="Licence" src="https://img.shields.io/github/license/hyperse-io/logger?style=flat-quare&labelColor=000000" />
  </a>

**A powerful, pluggable, and flexible type-safe logger for modern applications.**

</div>

## ✨ Features

- **🔌 Plugin Architecture**: Extensible logging through a powerful plugin system
- **🎯 Multiple Log Levels**: Support for Error, Warn, Info, Debug, and Verbose levels
- **⚡ Pipeline Processing**: Built on Hyperse Pipeline for efficient message processing
- **🎨 Customizable Context**: Extend logger context with custom properties
- **🛡️ TypeScript Support**: Full TypeScript support with comprehensive type definitions
- **🚀 High Performance**: Optimized for production use with minimal overhead
- **🔧 Flexible Configuration**: Easy setup with sensible defaults
- **📝 Rich Message Formatting**: Support for structured logging with metadata
- **🔄 Async Support**: Built-in support for asynchronous operations
- **🛠️ Error Handling**: Comprehensive error handling and recovery mechanisms
- **🎭 Multiple Output Formats**: Console, file, and custom output formats
- **🔍 Debugging Tools**: Enhanced debugging capabilities with stack traces

## 📦 Installation

```bash
# Install the core logger
npm install @hyperse/logger

# Install plugins for different output formats
npm install @hyperse/logger-plugin-console  # Console output with colors
npm install @hyperse/logger-plugin-std      # Standard output formatting
```

## 🚀 Quick Start

### Basic Usage

```typescript
import { createLogger, LogLevel } from '@hyperse/logger';
import { createConsolePlugin } from '@hyperse/logger-plugin-console';

// Create a logger with console output
const logger = createLogger({
  name: 'my-app',
  thresholdLevel: LogLevel.Info,
})
  .use(createConsolePlugin())
  .build();

// Use the logger
logger.info('Application started');
logger.warn('Deprecated feature used');
logger.error('Something went wrong');
logger.debug('Debug information');
logger.verbose('Detailed debug info');
```

### Advanced Usage with Custom Context

```typescript
import { createLogger, LogLevel } from '@hyperse/logger';
import { createConsolePlugin } from '@hyperse/logger-plugin-console';

// Define custom context type
type AppContext = {
  userId?: string;
  requestId?: string;
  environment: 'development' | 'production';
};

// Create logger with custom context
const logger = createLogger<AppContext>({
  name: 'api-server',
  thresholdLevel: LogLevel.Debug,
  environment: 'development',
  setup: async () => ({
    // Dynamic context that can be set per request
    userId: getCurrentUserId(),
    requestId: generateRequestId(),
  }),
})
  .use(createConsolePlugin())
  .build();

// Log with context
logger.info('User login successful');
logger.error('Database connection failed');
```

## 🔌 Plugin System

Hyperse Logger uses a powerful plugin architecture that allows you to customize every aspect of the logging process. Plugins can be combined to create sophisticated logging pipelines.

### Available Plugins

#### Console Plugin (`@hyperse/logger-plugin-console`)

A console plugin for [@hyperse/logger](https://github.com/hyperse-io/logger) that provides rich console output with customizable formatting, colors, and timestamps.

**Features:**

- Support browser
- Colored output for different log levels
- Customizable timestamp formats
- Configurable message formatting
- Support for logger and plugin names
- Prefix and metadata display

**Quick Setup:**

```typescript
import { createConsolePlugin } from '@hyperse/logger-plugin-console';

const consolePlugin = createConsolePlugin();
```

📖 **[View detailed documentation →](./packages/logger-plugin-console/README.md)**

#### Std Plugin (`@hyperse/logger-plugin-std`)

A standard output plugin for [@hyperse/logger](https://github.com/hyperse-io/logger) that provides rich terminal output with customizable formatting, colors, and timestamps. This plugin is designed specifically for Node.js environments and outputs to

**Features:**

- Support node
- Consistent output format
- JSON-compatible formatting
- Production-ready configuration
- Structured logging support
- Minimal overhead

**Quick Setup:**

```typescript
import { createStdPlugin } from '@hyperse/logger-plugin-std';

const stdPlugin = createStdPlugin();
```

📖 **[View detailed documentation →](./packages/logger-plugin-std/README.md)**

### Creating Custom Plugins

You can create your own plugins using the `definePlugin` function:

```typescript
import { definePlugin, LogLevel } from '@hyperse/logger';

const filePlugin = definePlugin({
  pluginName: 'file-logger',
  execute: async ({ ctx, level, message, pipe }) => {
    await pipe(
      // Transform message format
      () => ({
        timestamp: new Date().toISOString(),
        level: LogLevel[level],
        message: message,
        context: ctx,
      }),
      // Write to file
      (logEntry) => {
        fs.appendFileSync('app.log', JSON.stringify(logEntry) + '\n');
      }
    )();
  },
});

// Use the custom plugin
const logger = createLogger().use(filePlugin).build();
```

### Plugin Composition

Combine multiple plugins for sophisticated logging setups:

```typescript
import { createLogger } from '@hyperse/logger';
import { createConsolePlugin } from '@hyperse/logger-plugin-console';
import { createStdPlugin } from '@hyperse/logger-plugin-std';

const logger = createLogger()
  .use(createConsolePlugin()) // Development output
  .use(createStdPlugin()) // Production output
  .use(customFilePlugin) // Custom file logging
  .build();
```

## 📊 Log Levels

Hyperse Logger supports five log levels, ordered by severity:

| Level     | Value | Description                                      |
| --------- | ----- | ------------------------------------------------ |
| `Error`   | 0     | Critical errors that require immediate attention |
| `Warn`    | 1     | Warnings that may need investigation             |
| `Info`    | 2     | General information and startup messages         |
| `Debug`   | 3     | Detailed debug information                       |
| `Verbose` | 4     | Additional detailed information                  |

### Setting Log Level

```typescript
import { LogLevel } from '@hyperse/logger';

const logger = createLogger({
  thresholdLevel: LogLevel.Info, // Only logs Info, Warn, and Error
})
  .use(createConsolePlugin())
  .build();
```

## 🎯 Message Types

The logger supports both string and object messages with rich metadata:

### String Messages

```typescript
logger.info('Simple string message');
logger.error('Error occurred');
```

### Object Messages

```typescript
logger.info({
  name: 'user-login',
  message: 'User logged in successfully',
  prefix: 'AUTH',
});
```

### Error Objects

```typescript
try {
  // Some operation
} catch (error) {
  logger.error({
    name: error.name,
    message: error.message,
    stack: error.stack,
  });
}
```

## 🔧 Configuration Options

### Logger Options

```typescript
const logger = createLogger({
  name: 'my-app', // Logger name
  thresholdLevel: LogLevel.Info, // Minimum log level
  setup: async () => ({
    // Dynamic context setup
    userId: getCurrentUserId(),
    requestId: generateRequestId(),
  }),
  errorHandling: (error) => {
    // Error handling function
    console.error('Logger error:', error);
  },
});
```

## 🏗️ Architecture

Hyperse Logger is built on top of the Hyperse Pipeline system, providing:

- **Pipeline Processing**: Each log message goes through a configurable pipeline
- **Plugin Isolation**: Plugins are isolated and can be composed independently
- **Context Sharing**: Context is shared across the entire pipeline
- **Error Handling**: Built-in error handling for pipeline failures
- **Type Safety**: Full TypeScript support throughout the pipeline

### Pipeline Flow

```
Log Message → Plugin 1 → Plugin 2 → ... → Plugin N → Output
     ↓           ↓         ↓              ↓
   Context    Context   Context       Context
```

### Core Components

- **Logger**: Main entry point for logging operations
- **Pipeline**: Message processing engine
- **Plugins**: Extensible output and processing modules
- **Context**: Shared state across the pipeline
- **Message**: Structured log data with metadata

## 🚀 Performance

Hyperse Logger is designed for high-performance applications:

- **Minimal Overhead**: Optimized for production use
- **Async Processing**: Non-blocking log operations
- **Memory Efficient**: Efficient memory usage patterns
- **Configurable Buffering**: Optional message buffering for high-throughput scenarios

## 🔗 Related Projects

- [@hyperse/pipeline](https://github.com/hyperse-io/pipeline) - The pipeline system that powers Hyperse Logger
- [@hyperse/logger-plugin-console](https://www.npmjs.com/package/@hyperse/logger-plugin-console) - Console output plugin
- [@hyperse/logger-plugin-std](https://www.npmjs.com/package/@hyperse/logger-plugin-std) - Standard output plugin

## License

This project is licensed under the [MIT LICENSE](./LICENSE).
