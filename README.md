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

**A powerful, pluggable, and flexible type-safe logger.**

</div>

## ✨ Features

- **🔌 Plugin Architecture**: Extensible logging through a powerful plugin system
- **🎯 Multiple Log Levels**: Support for Error, Warn, Info, Debug, and Verbose levels
- **⚡ Pipeline Processing**: Built on Hyperse Pipeline for efficient message processing
- **🎨 Customizable Context**: Extend logger context with custom properties
- **🛡️ TypeScript Support**: Full TypeScript support with comprehensive type definitions
- **🚀 High Performance**: Optimized for production use with minimal overhead
- **🔧 Flexible Configuration**: Easy setup with sensible defaults

## 📦 Installation

```bash
# Install the core logger
npm install @hyperse/logger

# Install console plugin for basic console output
npm install @hyperse/logger-plugin-console
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

Hyperse Logger uses a powerful plugin architecture that allows you to customize every aspect of the logging process.

### Available Plugins

#### Console Plugin (`@hyperse/logger-plugin-console`)

Provides formatted console output with colors and timestamps.

```typescript
import { createConsolePlugin } from '@hyperse/logger-plugin-console';

const consolePlugin = createConsolePlugin({
  showTimestamp: true, // Show timestamp
  showLevelName: true, // Show log level name
  noColor: false, // Enable color output
});
```

### Creating Custom Plugins

You can create your own plugins using the `definePlugin` function:

```typescript
import { definePlugin, LogLevel } from '@hyperse/logger';

const filePlugin = definePlugin({
  pluginName: 'file-logger',
  execute: async ({ ctx, level, message, pipe }) => {
    await pipe(
      // Transform message format
      (msg) => ({
        timestamp: new Date().toISOString(),
        level: LogLevel[level],
        message: msg,
        context: ctx,
      }),
      // Write to file
      (logEntry) => {
        fs.appendFileSync('app.log', JSON.stringify(logEntry) + '\n');
      }
    )(message);
  },
});

// Use the custom plugin
const logger = createLogger().use(filePlugin).build();
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

The logger supports both string and object messages:

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
  prefix: '[AUTH]',
  metadata: {
    userId: '12345',
    method: 'email',
  },
});
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
  }),
  errorHandling: (error) => {
    // Error handling function
    console.error('Logger error:', error);
  },
});
```

### Console Plugin Options

```typescript
const consolePlugin = createConsolePlugin({
  // ===== Basic Settings =====
  disable: false, // Whether to disable the plugin
  noColor: false, // Whether to remove all color output

  // ===== Logger Name Display =====
  showLoggerName: false, // Whether to show logger name
  capitalizeLoggerName: false, // Whether to capitalize logger name
  loggerNameColor: ['bold', 'magenta'], // Color for logger name

  // ===== Plugin Name Display =====
  showPluginName: false, // Whether to show plugin name
  capitalizePluginName: false, // Whether to capitalize plugin name
  pluginNameColor: ['bold', 'magenta'], // Color for plugin name

  // ===== Message Formatting =====
  showPrefix: true, // Whether to show message prefix
  showLevelName: false, // Whether to show log level name, e.g., [ERROR]
  capitalizeLevelName: false, // Whether to capitalize level name
  showArrow: false, // Whether to show arrow symbol before message (>>)
  prefixColor: ['bold', 'magenta'], // Color for prefix

  // ===== Timestamp Options =====
  showDate: false, // Whether to show date, format like [12d/5m/2011y]
  showTimestamp: false, // Whether to show timestamp, format like [13:43:10.23]
  use24HourClock: false, // Whether to use 24-hour clock format

  // ===== Level Color Configuration =====
  levelColor: {
    // Custom colors for each log level
    [LogLevel.Error]: ['red'], // Error level - red
    [LogLevel.Warn]: ['yellow'], // Warn level - yellow
    [LogLevel.Info]: ['green'], // Info level - green
    [LogLevel.Debug]: ['blue'], // Debug level - blue
    [LogLevel.Verbose]: ['magenta'], // Verbose level - magenta
  },
});
```

## 🏗️ Architecture

Hyperse Logger is built on top of the Hyperse Pipeline system, providing:

- **Pipeline Processing**: Each log message goes through a configurable pipeline
- **Plugin Isolation**: Plugins are isolated and can be composed independently
- **Context Sharing**: Context is shared across the entire pipeline
- **Error Handling**: Built-in error handling for pipeline failures

### Pipeline Flow

```
Log Message → Plugin 1 → Plugin 2 → ... → Plugin N → Output
     ↓           ↓         ↓              ↓
   Context    Context   Context       Context
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Projects

- [@hyperse/pipeline](https://github.com/hyperse-io/pipeline) - The pipeline system that powers Hyperse Logger
- [@hyperse/logger-plugin-console](https://www.npmjs.com/package/@hyperse/logger-plugin-console) - Console output plugin
