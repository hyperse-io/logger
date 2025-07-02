# @hyperse/logger-plugin-stdout

A standard output plugin for [@hyperse/logger](https://github.com/hyperse-io/logger) that provides rich terminal output with customizable formatting, colors, and timestamps. This plugin is designed specifically for Node.js environments and outputs to `process.stdout`.

## Installation

```bash
npm install @hyperse/logger-plugin-stdout
# or
yarn add @hyperse/logger-plugin-stdout
# or
pnpm add @hyperse/logger-plugin-stdout
```

## Quick Start

```typescript
import { createLogger, LogLevel } from '@hyperse/logger';
import { createStdoutPlugin } from '@hyperse/logger-plugin-stdout';

const logger = createLogger({
  name: 'my-app',
  thresholdLevel: LogLevel.Info,
})
  .use(createStdoutPlugin())
  .build();

logger.info('Hello, World!');
logger.warn('This is a warning');
logger.error('Something went wrong');
```

## Usage

```typescript
import { createLogger, LogLevel } from '@hyperse/logger';
import { createStdoutPlugin } from '@hyperse/logger-plugin-stdout';

const logger = createLogger({
  name: 'my-app',
  thresholdLevel: LogLevel.Debug,
})
  .use(createStdoutPlugin())
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

### `createStdoutPlugin(options?: StdOptions)`

Creates a standard output plugin instance with the specified options.

#### Parameters

- `options` (optional): Configuration options for the std plugin

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

- **Default**: `false`

### `capitalizeLevelName?: boolean`

If `true`, the level name will be capitalized.

- **Default**: `false`

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

- **Default**: `false`

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

- **Default**: `false`

### `showArrow?: boolean`

If `true`, a cool arrow will be shown before each log message.

**Example:**

```
>> baz
```

- **Default**: `false`

### `noColor?: boolean`

If `true`, colors will be removed from the terminal output.

- **Default**: `false`

### `levelColor?: { [key in LogLevel]?: Color[] }`

Custom colors for different log levels using picocolors.

**Default:**

```typescript
{
  [LogLevel.Error]: ['red'],
  [LogLevel.Warn]: ['yellow'],
  [LogLevel.Info]: ['green'],
  [LogLevel.Debug]: ['blue'],
  [LogLevel.Verbose]: ['magenta'],
}
```

**Available Colors:**

- `'black'`, `'red'`, `'green'`, `'yellow'`, `'blue'`, `'magenta'`, `'cyan'`, `'white'`
- `'gray'`, `'grey'`
- `'blackBright'`, `'redBright'`, `'greenBright'`, `'yellowBright'`, `'blueBright'`, `'magentaBright'`, `'cyanBright'`, `'whiteBright'`
- `'bgBlack'`, `'bgRed'`, `'bgGreen'`, `'bgYellow'`, `'bgBlue'`, `'bgMagenta'`, `'bgCyan'`, `'bgWhite'`
- `'bgBlackBright'`, `'bgRedBright'`, `'bgGreenBright'`, `'bgYellowBright'`, `'bgBlueBright'`, `'bgMagentaBright'`, `'bgCyanBright'`, `'bgWhiteBright'`
- `'bold'`, `'dim'`, `'italic'`, `'underline'`, `'inverse'`, `'hidden'`, `'strikethrough'`, `'reset'`

### `prefixColor?: Color[]`

The color for the prefix.

- **Default**: `['bold', 'magenta']`

### `loggerNameColor?: Color[]`

The color for the logger name.

- **Default**: `['bold', 'magenta']`

### `pluginNameColor?: Color[]`

The color for the plugin name.

- **Default**: `['bold', 'magenta']`

## Examples

### Minimal Configuration

```typescript
const logger = createLogger({
  name: 'app',
  thresholdLevel: LogLevel.Info,
})
  .use(createStdoutPlugin())
  .build();
```

### Full Featured Configuration

```typescript
const logger = createLogger({
  name: 'my-application',
  thresholdLevel: LogLevel.Verbose,
})
  .use(
    createStdoutPlugin({
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
        [LogLevel.Error]: ['red', 'bold'],
        [LogLevel.Warn]: ['yellow', 'bold'],
        [LogLevel.Info]: ['green', 'bold'],
        [LogLevel.Debug]: ['blue', 'bold'],
        [LogLevel.Verbose]: ['magenta', 'bold'],
      },
      prefixColor: ['bold', 'cyan'],
      loggerNameColor: ['bold', 'blue'],
      pluginNameColor: ['bold', 'green'],
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
[ 13:43:10 ] [ INFO ] [ MY-APP : HPS-LOGGER-PLUGIN-STD ] >> info message
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

## Environment Requirements

This plugin is specifically designed for **Node.js environments** and requires:

- Node.js >= 18.0.0
- Access to `process.stdout` for output
- `@hyperse/logger` as a peer dependency

The plugin will automatically detect if it's running in a Node.js environment and will exit gracefully with an error message if used in a non-Node.js environment.

## Dependencies

- `@hyperse/logger` - Core logger functionality
- `picocolors` - Terminal color support
