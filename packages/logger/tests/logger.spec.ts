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
      .build({
        env: 'browser',
      });

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
      '[error] ctx: sampleLogger browser 0 error error message'
    );
    expect(executeMock.mock.calls[1][0]).toEqual(
      '[warn] ctx: sampleLogger browser 1 warn warn message'
    );
    expect(executeMock.mock.calls[2][0]).toEqual(
      '[info] ctx: sampleLogger browser 2 info info message'
    );
    expect(executeMock.mock.calls[3][0]).toEqual(
      '[debug] ctx: sampleLogger browser 3 debug debug message'
    );
    expect(executeMock.mock.calls[4][0]).toEqual(
      '[verbose] ctx: sampleLogger browser 4 verbose verbose message'
    );
  });

  // Test case for function messages
  it('should handle function messages correctly', async () => {
    const errorHandlingMock = vi.fn();
    const executeMock = vi.fn();

    const consolePlugin = definePlugin({
      pluginName: 'consolePlugin',
      execute({ message }) {
        if (typeof message === 'string') {
          executeMock(message);
        } else if (typeof message === 'object') {
          if (message.prefix) {
            executeMock(`${message.prefix} ${message.message}`);
          } else {
            executeMock(message.message);
          }
        }
      },
    });

    type AppContext = {
      userId: string;
      environment: string;
    };

    const logger = createLogger<AppContext>({
      thresholdLevel: LogLevel.Verbose,
      name: 'functionLogger',
      environment: 'production',
      userId: '',
      errorHandling: errorHandlingMock,
    })
      .use(consolePlugin)
      .build(async () => Promise.resolve({ userId: 'user-123' }));
    // 1. Test string-returning function message
    logger.info(
      (ctx) => `User ${ctx.userId} logged in from ${ctx.environment}`
    );

    // 2. Test object-returning function message
    logger.warn((ctx) => ({
      message: `Warning for ${ctx.userId}`,
      prefix: '[WARNING]',
    }));

    // 3. Test dynamic context modification
    logger.debug((ctx) => {
      // Test that context is immutable - create a new object instead
      const localCtx = { ...ctx, userId: 'user-456' };
      return `Updated user: ${localCtx.userId}`;
    });

    // 4. Test using modified context
    logger.info((ctx) => `Now user is ${ctx.userId}`);

    // 5. Test error handling
    logger.error(() => {
      throw new Error('Test error in message function');
    });

    await sleep(100);

    // Verify results
    expect(executeMock).toHaveBeenCalledTimes(4);
    expect(executeMock.mock.calls[0][0]).toBe(
      'User user-123 logged in from production'
    );
    expect(executeMock.mock.calls[1][0]).toBe('[WARNING] Warning for user-123');
    expect(executeMock.mock.calls[2][0]).toBe('Updated user: user-456');
    expect(executeMock.mock.calls[3][0]).toBe('Now user is user-123');

    // Verify error message handling
    expect(errorHandlingMock).toHaveBeenCalledTimes(1);
    expect(errorHandlingMock.mock.calls[0][0].message).toBe(
      'Test error in message function'
    );
  });

  // New test case: Handling function messages in pipeline plugins
  it('should handle function messages in pipeline plugins', async () => {
    type AppContext = {
      env: string;
      version: string;
    };

    const executeMock = vi.fn();

    const consolePlugin = definePlugin<AppContext>({
      pluginName: 'consolePlugin',
      execute({ ctx, level, message, pipe }) {
        pipe(
          (ctx: AppContext) => ctx,
          // Resolve function message
          () => message,
          (msg) => {
            if (typeof msg === 'string') {
              executeMock(`[${LogLevel[level]}] ${msg}`);
            } else {
              executeMock(`[${LogLevel[level]}] ${msg.message}`);
            }
          }
        )(ctx);
      },
    });

    const logger = createLogger<AppContext>({
      thresholdLevel: LogLevel.Verbose,
      name: 'pipelineLogger',
      env: 'production',
      version: '1.0.0',
    })
      .use(consolePlugin)
      .build();

    // Function message - string
    logger.info((ctx) => `App v${ctx.version} running in ${ctx.env}`);

    // Function message - object
    logger.warn((ctx) => ({
      message: `Deprecated feature in ${ctx.env} v${ctx.version}`,
    }));

    // Regular string message
    logger.error('Critical error occurred');

    await sleep(100);

    expect(executeMock).toHaveBeenCalledTimes(3);
    expect(executeMock.mock.calls[0][0]).toBe(
      '[Info] App v1.0.0 running in production'
    );
    expect(executeMock.mock.calls[1][0]).toBe(
      '[Warn] Deprecated feature in production v1.0.0'
    );
    expect(executeMock.mock.calls[2][0]).toBe(
      '[Error] Critical error occurred'
    );
  });
});
