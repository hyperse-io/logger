import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LogLevel } from '../src/constant/log-level.js';
import { createLogger } from '../src/core/create-logger.js';
import type { LoggerContext } from '../src/index.js';
import { definePlugin } from '../src/plugin/define-plugin.js';
import { setUpForTest } from './test-utils.js';

describe('sample logger', () => {
  let mockConsoleLog: ReturnType<typeof vi.spyOn>;
  let mockConsoleWarn: ReturnType<typeof vi.spyOn>;
  let mockConsoleError: ReturnType<typeof vi.spyOn>;
  let mockConsoleDebug: ReturnType<typeof vi.spyOn>;
  let mockConsoleInfo: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
    mockConsoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockConsoleDebug = vi.spyOn(console, 'debug').mockImplementation(() => {});
    mockConsoleInfo = vi.spyOn(console, 'info').mockImplementation(() => {});
  });

  afterEach(() => {
    mockConsoleLog.mockRestore();
    mockConsoleWarn.mockRestore();
    mockConsoleError.mockRestore();
    mockConsoleDebug.mockRestore();
    mockConsoleInfo.mockRestore();
  });

  it('sample logger', async () => {
    const consolePlugin = definePlugin({
      name: 'consolePlugin',
      setup(ctx, level, message) {
        setUpForTest(ctx, level, message);
      },
    });

    type NewLoggerContext = LoggerContext & {
      env: 'node' | 'browser';
    };

    const logger = createLogger<NewLoggerContext>({
      level: LogLevel.Verbose,
      name: 'sampleLogger',
      env: 'node',
    })
      .use(consolePlugin)
      .build();

    await logger.info('info message');
    await logger.debug('debug message');
    await logger.verbose('verbose message');
    await logger.warn('warn message');
    await logger.error('error message');

    expect(mockConsoleLog).toHaveBeenCalledTimes(1);
    expect(mockConsoleWarn).toHaveBeenCalledTimes(1);
    expect(mockConsoleError).toHaveBeenCalledTimes(1);
    expect(mockConsoleDebug).toHaveBeenCalledTimes(1);
    expect(mockConsoleInfo).toHaveBeenCalledTimes(1);
  });

  it('multiple plugins', async () => {
    const consolePlugin = definePlugin({
      name: 'consolePlugin',
      setup(ctx, level, message) {
        setUpForTest(ctx, level, message);
      },
    });

    const terminalPlugin = definePlugin({
      name: 'terminalPlugin',
      setup(ctx, level, message) {
        setUpForTest(ctx, level, message);
      },
    });

    type NewLoggerContext = LoggerContext & {
      env: 'node' | 'browser';
    };

    const logger = createLogger<NewLoggerContext>({
      level: LogLevel.Verbose,
      name: 'sampleLogger',
      env: 'node',
    })
      .use(consolePlugin)
      .use(terminalPlugin)
      .use(() => {
        return {
          name: 'webPlugin',
          setup(ctx, level, message) {
            setUpForTest(ctx, level, message);
          },
        };
      })
      .use(() => {
        return {
          name: 'sentryPlugin',
          setup(ctx, level, message) {
            setUpForTest(ctx, level, message);
          },
        };
      })
      .build();

    await logger.info('info message');
    await logger.debug('debug message');
    await logger.verbose('verbose message');
    await logger.warn('warn message');
    await logger.error('error message');

    expect(mockConsoleLog).toHaveBeenCalledTimes(4);
    expect(mockConsoleWarn).toHaveBeenCalledTimes(4);
    expect(mockConsoleError).toHaveBeenCalledTimes(4);
    expect(mockConsoleDebug).toHaveBeenCalledTimes(4);
    expect(mockConsoleInfo).toHaveBeenCalledTimes(4);
  });
});
