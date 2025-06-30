import { describe, expect, it, vi } from 'vitest';
import { LogLevel } from '../src/constant/log-level.js';
import { createLogger } from '../src/core/create-logger.js';
import type { LoggerContext } from '../src/index.js';
import { definePlugin } from '../src/plugin/define-plugin.js';
import type { LoggerMessage } from '../src/types/type-plugin.js';

describe('error logger', () => {
  it('throw error when execute error log', async () => {
    const consolePlugin = definePlugin({
      name: 'consolePlugin',
      setup() {
        throw new Error('console plugin error');
      },
    });

    type NewLoggerContext = LoggerContext & {
      env: 'node' | 'browser';
    };

    const setupMock = vi.fn((_: any, __: any, message: LoggerMessage) => {
      console.log('error message', message.name, message.message);
    });

    const mockErrorLogger = {
      name: 'errorPlugin',
      setup: setupMock,
    };
    vi.spyOn(
      await import('../src/helpers/helper-error-logger.js'),
      'createErrorLogger'
    ).mockReturnValue(mockErrorLogger);

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

    expect(setupMock).toHaveBeenCalledTimes(5);
    expect(setupMock.mock.lastCall?.[0]).toMatchObject({
      env: 'node',
      level: LogLevel.Verbose,
      name: 'sampleLogger',
      pluginName: 'errorPlugin',
    });
    expect(setupMock.mock.lastCall?.[1]).toEqual(LogLevel.Error);
    expect(setupMock.mock.lastCall?.[2]).toMatchObject({
      name: 'Error',
      message: 'console plugin error',
      stack: expect.any(String),
    });
  });
});
