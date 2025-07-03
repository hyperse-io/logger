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
      setup() {
        return {
          env: 'browser',
        };
      },
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

  // 函数消息测试用例
  it('should handle function messages correctly', async () => {
    const executeMock = vi.fn();

    const consolePlugin = definePlugin({
      pluginName: 'consolePlugin',
      execute({ message }) {
        if (typeof message === 'string') {
          executeMock(message);
        } else if (typeof message === 'object') {
          executeMock(`${message.prefix} ${message.message}`);
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
      setup: async () => Promise.resolve({ userId: 'user-123' }),
    })
      .use(consolePlugin)
      .build();
    // 1. 测试返回字符串的函数消息
    logger.info(
      (ctx) => `User ${ctx.userId} logged in from ${ctx.environment}`
    );

    // 2. 测试返回对象的函数消息
    logger.warn((ctx) => ({
      message: `Warning for ${ctx.userId}`,
      prefix: '[WARNING]',
    }));

    // 3. 测试动态修改上下文
    logger.debug((ctx: any) => {
      (ctx as any).userId = 'user-456'; // 假修改
      return `Updated user: ${ctx.userId}`;
    });

    // 4. 测试使用修改后的上下文
    logger.info((ctx) => `Now user is ${ctx.userId}`);

    // 5. 测试错误处理
    logger.error(() => {
      throw new Error('Test error in message function');
    });

    await sleep(100);

    // 验证结果
    expect(executeMock).toHaveBeenCalledTimes(5);
    expect(executeMock.mock.calls[0][0]).toBe(
      'User user-123 logged in from production'
    );
    expect(executeMock.mock.calls[1][0]).toBe('[WARNING] Warning for user-123');
    expect(executeMock.mock.calls[2][0]).toBe('Updated user: user-456');
    expect(executeMock.mock.calls[3][0]).toBe('Now user is user-123');

    // 验证错误消息处理
    expect(executeMock.mock.calls[4][0]).toContain('消息函数执行失败');
  });

  // 新增测试用例：在管道插件中处理函数消息
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
          // 解析函数消息
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

    // 函数消息 - 字符串
    logger.info((ctx) => `App v${ctx.version} running in ${ctx.env}`);

    // 函数消息 - 对象
    logger.warn((ctx) => ({
      message: `Deprecated feature in ${ctx.env} v${ctx.version}`,
    }));

    // 普通字符串消息
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
