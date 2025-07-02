# @hyperse/logger-plugin-console

A console plugin for [@hyperse/logger](https://github.com/hyperse-io/logger) that provides rich console output with customizable formatting, colors, and timestamps.

## Installation

```bash
npm install @hyperse/logger-plugin-console
# or
yarn add @hyperse/logger-plugin-console
# or
pnpm add @hyperse/logger-plugin-console
```

## Quick Start

```typescript
import { createLogger, LogLevel } from '@hyperse/logger';
import { createConsolePlugin } from '@hyperse/logger-plugin-console';

const logger = createLogger({
  name: 'my-app',
  thresholdLevel: LogLevel.Info,
})
  .use(createConsolePlugin())
  .build();

logger.info('Hello, World!');
logger.warn('This is a warning');
logger.error('Something went wrong');
```

## Usage

```typescript
import { createLogger, LogLevel } from '@hyperse/logger';
import { createConsolePlugin } from '@hyperse/logger-plugin-console';

const logger = createLogger({
  name: 'my-app',
  thresholdLevel: LogLevel.Debug,
})
  .use(createConsolePlugin())
  .build();

// Simple messages
logger.info('Application started');
logger.debug('Debug information');
logger.warn('Warning message');
logger.error('Error occurred');

// Structured messages
logger.info({
  prefix: 'API',
  name: 'request',
  message: 'Processing user request',
});

logger.error({
  name: 'database',
  message: 'Connection failed',
  stack: error.stack,
});
```

## API Reference

### `createConsolePlugin(options?: ConsoleOptions)`

Creates a console plugin instance with the specified options.

#### Parameters

- `options` (optional): Configuration options for the console plugin

#### Returns

A plugin instance that can be used with `@hyperse/logger`

## Configuration Options

### `disable?: boolean`

If `true`, the plugin will be disabled.

- **Default**: `false`

### `showLoggerName?: boolean`

If `true`, the logger name will be shown in the output.

- **Default**: `false`

### `capitalizeLoggerName?: boolean`

If `true`, the logger name will be capitalized.

- **Default**: `false`

### `showPluginName?: boolean`

If `true`, the plugin name will be shown in the output.

- **Default**: `false`

### `capitalizePluginName?: boolean`

If `true`, the plugin name will be capitalized.

- **Default**: `false`

### `showPrefix?: boolean`

If `true`, the prefix will be shown in the output.

- **Default**: `true`

### `showLevelName?: boolean`

If `true`, each message will have the level name attached to it.

**Example:**

```
[ FATAL ] WHAT WILL I DO?!
[ ERROR ] Something went wrong
[ WARN ]  Warning message
[ INFO ]  Information
[ DEBUG ] Debug details
[ VERBOSE ] Verbose information
```

- **Default**: `true`

### `capitalizeLevelName?: boolean`

If `true`, the level name will be capitalized.

- **Default**: `true`

### `showDate?: boolean`

If `true`, each message will have a date attached to it.

**Example:**

```
[ 2025-7-1 ] foo
```

- **Default**: `false`

### `showTimestamp?: boolean`

If `true`, each message will have a timestamp attached to it.

**Example:**

```
[ 13:43:10.23 ] bar
```

- **Default**: `true`

### `use24HourClock?: boolean`

If `true`, timestamps will use 24-hour format instead of 12-hour format.

**24-hour clock:**

```
[ 13:27:55.33 ] pow
```

**12-hour clock:**

```
[ 1:27:55.33 PM ] pow
```

- **Default**: `true`

### `showArrow?: boolean`

If `true`, a cool arrow will be shown before each log message.

**Example:**

```
>> baz
```

- **Default**: `false`

### `noColor?: boolean`

If `true`, colors will be removed from the console output.

- **Default**: `false`

### `levelColor?: { [key in LogLevel]?: string }`

Custom colors for different log levels.

**Default:**

```typescript
{
  [LogLevel.Error]: 'color:red;',
  [LogLevel.Warn]: 'color:yellow;',
  [LogLevel.Info]: 'color:blue;',
  [LogLevel.Debug]: 'color:magenta;',
  [LogLevel.Verbose]: 'color:magenta;',
}
```

### `prefixColor?: string`

The color for the prefix.

- **Default**: `'color: magenta; font-weight: bold;'`

### `loggerNameColor?: string`

The color for the logger name.

- **Default**: `'color: cyan; font-weight: bold;'`

### `pluginNameColor?: string`

The color for the plugin name.

- **Default**: `'color: cyan; font-weight: bold;'`

## Examples

### Minimal Configuration

```typescript
const logger = createLogger({
  name: 'app',
  thresholdLevel: LogLevel.Info,
})
  .use(createConsolePlugin())
  .build();
```

### Full Featured Configuration

```typescript
const logger = createLogger({
  name: 'my-application',
  thresholdLevel: LogLevel.Verbose,
})
  .use(
    createConsolePlugin({
      disable: false,
      showTimestamp: true,
      showLoggerName: true,
      capitalizeLoggerName: true,
      showPluginName: true,
      capitalizePluginName: true,
      showPrefix: true,
      showLevelName: true,
      capitalizeLevelName: true,
      showDate: true,
      use24HourClock: true,
      showArrow: true,
      noColor: false,
      levelColor: {
        [LogLevel.Error]: 'color: #ff0000; font-weight: bold;',
        [LogLevel.Warn]: 'color: #ffaa00; font-weight: bold;',
        [LogLevel.Info]: 'color: #0066ff; font-weight: bold;',
        [LogLevel.Debug]: 'color: #aa00ff; font-weight: bold;',
        [LogLevel.Verbose]: 'color: #00aaff; font-weight: bold;',
      },
      prefixColor: 'color: #ff00ff; font-weight: bold;',
      loggerNameColor: 'color: #00ffff; font-weight: bold;',
      pluginNameColor: 'color: #ffff00; font-weight: bold;',
    })
  )
  .build();
```

### Production Configuration

```typescript
const logger = createLogger({
  name: 'production-app',
  thresholdLevel: LogLevel.Info,
})
  .use(
    createConsolePlugin({
      showTimestamp: true,
      showLoggerName: true,
      showLevelName: true,
      noColor: true, // Disable colors in production
    })
  )
  .build();
```

### Development Configuration

```typescript
const logger = createLogger({
  name: 'dev-app',
  thresholdLevel: LogLevel.Verbose,
})
  .use(
    createConsolePlugin({
      showTimestamp: true,
      showLoggerName: true,
      showLevelName: true,
      showArrow: true,
      showDate: true,
      use24HourClock: true,
      // Keep colors enabled for better readability
    })
  )
  .build();
```

## Output Examples

### Basic Output

```
info message
```

### With Timestamp and Level

```
[ 13:43:10 ] [ INFO ] info message
```

### With Logger Name and Plugin

```
[ 13:43:10 ] [ INFO ] [ MY-APP : HPS-LOGGER-PLUGIN-CONSOLE ] >> info message
```

### With Prefix

```
[ 13:43:10 ] [ INFO ] [ API ] >> Processing request
```

### Error with Stack Trace

```
[ 13:43:10 ] [ ERROR ] [ DATABASE ] >> Connection failed
Error: Connection failed
    at Database.connect (/app/database.js:15:10)
    at Server.start (/app/server.js:25:5)
```

## Requirements

- Node.js >= 18.0.0
- `@hyperse/logger` as a peer dependency
