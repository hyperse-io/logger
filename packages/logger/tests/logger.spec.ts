import { createLogger } from '../src/core/create-logger.js';
import type { LoggerContext } from '../src/index.js';
import { LogLevel } from '../src/index.js';
import { definePlugin } from '../src/plugin/define-plugin.js';
import { setUpForTest, sleep } from './test-utils.js';

describe('Logger Basic Functionality', () => {
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

  it('should log messages with single plugin', async () => {
    const consolePlugin = definePlugin({
      pluginName: 'consolePlugin',
      execute({ ctx, level, message }) {
        setUpForTest(ctx, level, message);
      },
    });

    type NewLoggerContext = {
      env: 'node' | 'browser';
    };

    const logger = createLogger<NewLoggerContext>({
      thresholdLevel: LogLevel.Verbose,
      name: 'sampleLogger',
      env: 'node',
    })
      .use(consolePlugin)
      .build();

    logger.info('info message');
    logger.debug('debug message');
    logger.verbose('verbose message');
    logger.warn('warn message');
    logger.error('error message');

    await sleep(100);

    expect(mockConsoleLog).toHaveBeenCalledTimes(1);
    expect(mockConsoleWarn).toHaveBeenCalledTimes(1);
    expect(mockConsoleError).toHaveBeenCalledTimes(1);
    expect(mockConsoleDebug).toHaveBeenCalledTimes(1);
    expect(mockConsoleInfo).toHaveBeenCalledTimes(1);
  });

  it('should log messages with multiple plugins', async () => {
    const consolePlugin = definePlugin({
      pluginName: 'consolePlugin',
      execute({ ctx, level, message }) {
        setUpForTest(ctx, level, message);
      },
    });

    const terminalPlugin = definePlugin({
      pluginName: 'terminalPlugin',
      execute({ ctx, level, message }) {
        setUpForTest(ctx, level, message);
      },
    });

    type NewLoggerContext = LoggerContext & {
      env: 'node' | 'browser';
    };

    const logger = createLogger<NewLoggerContext>({
      thresholdLevel: LogLevel.Verbose,
      name: 'sampleLogger',
      env: 'node',
    })
      .use(consolePlugin)
      .use(terminalPlugin)
      .build();

    logger.info('info message');
    logger.debug('debug message');
    logger.verbose('verbose message');
    logger.warn('warn message');
    logger.error('error message');

    await sleep(100);

    expect(mockConsoleLog).toHaveBeenCalledTimes(2);
    expect(mockConsoleWarn).toHaveBeenCalledTimes(2);
    expect(mockConsoleError).toHaveBeenCalledTimes(2);
    expect(mockConsoleDebug).toHaveBeenCalledTimes(2);
    expect(mockConsoleInfo).toHaveBeenCalledTimes(2);
  });

  it('should log messages with multiple plugins pipeline', async () => {
    type NewLoggerContext = {
      env: 'node' | 'browser';
    };

    const executeMock = vi.fn((message: string) => {
      console.log(message);
    });

    const consolePlugin = definePlugin<NewLoggerContext>({
      pluginName: 'consolePlugin',
      execute({ ctx, level, message, pipe }) {
        pipe(
          (ctx: LoggerContext<NewLoggerContext>) => ctx,
          (ctx) => {
            if (typeof message === 'string') {
              return `ctx: ${ctx.name} ${ctx.env} ${level} ${message}`;
            }
            return `${message.prefix} ctx: ${ctx.name} ${ctx.env} ${level} ${message.name} ${message.message}`;
          },
          (msg) => {
            executeMock(msg);
          }
        )(ctx);
      },
    });

    const logger = createLogger<NewLoggerContext>({
      thresholdLevel: LogLevel.Verbose,
      name: 'sampleLogger',
      env: 'node',
    })
      .use(consolePlugin)
      .build();

    logger.error({
      name: 'error',
      message: 'error message',
      prefix: '[error]',
    });
    logger.warn({
      name: 'warn',
      message: 'warn message',
      prefix: '[warn]',
    });
    logger.info({
      name: 'info',
      message: 'info message',
      prefix: '[info]',
    });
    logger.debug({
      name: 'debug',
      message: 'debug message',
      prefix: '[debug]',
    });
    logger.verbose({
      name: 'verbose',
      message: 'verbose message',
      prefix: '[verbose]',
    });

    await sleep(100);

    expect(executeMock).toHaveBeenCalledTimes(5);
    expect(executeMock.mock.calls[0][0]).toEqual(
      '[error] ctx: sampleLogger node 0 error error message'
    );
    expect(executeMock.mock.calls[1][0]).toEqual(
      '[warn] ctx: sampleLogger node 1 warn warn message'
    );
    expect(executeMock.mock.calls[2][0]).toEqual(
      '[info] ctx: sampleLogger node 2 info info message'
    );
    expect(executeMock.mock.calls[3][0]).toEqual(
      '[debug] ctx: sampleLogger node 3 debug debug message'
    );
    expect(executeMock.mock.calls[4][0]).toEqual(
      '[verbose] ctx: sampleLogger node 4 verbose verbose message'
    );
  });
});
