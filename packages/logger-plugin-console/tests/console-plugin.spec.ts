import { createLogger, LogLevel } from '@hyperse/logger';
import { createConsolePlugin } from '../src/create-console-plugin.js';

describe('createConsolePlugin', () => {
  // @ts-ignore
  let mockConsoleLog: ReturnType<typeof vi.spyOn<typeof console, 'log'>>;

  beforeEach(() => {
    mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    mockConsoleLog.mockRestore();
  });

  it('does not log when plugin is disabled', async () => {
    const logger = createLogger({
      name: 'hps-logger',
      thresholdLevel: LogLevel.Verbose,
    })
      .use(createConsolePlugin({ disable: true }))
      .build();

    await logger.info('info message');

    expect(mockConsoleLog).not.toHaveBeenCalled();
  });

  it('logs string message (info)', async () => {
    const logger = createLogger({
      name: 'hps-logger',
      thresholdLevel: LogLevel.Verbose,
    })
      .use(createConsolePlugin({ noColor: true }))
      .build();

    await logger.info('info message');

    expect(mockConsoleLog).toHaveBeenCalledTimes(1);
    const output = mockConsoleLog.mock.calls[0][0];
    expect(output).toMatch(/\[ INFO \]/);
    expect(output).toMatch(/info message/);
  });

  it('logs object message (warn)', async () => {
    const logger = createLogger({
      name: 'hps-logger',
      thresholdLevel: LogLevel.Verbose,
    })
      .use(createConsolePlugin({ noColor: true }))
      .build();

    await logger.warn({
      prefix: 'warn prefix',
      name: 'warn name',
      message: 'warn message',
    });

    expect(mockConsoleLog).toHaveBeenCalledTimes(1);
    const output = mockConsoleLog.mock.calls[0][0];
    expect(output).toMatch(/\[ WARN \]/);
    expect(output).toMatch(/WARN PREFIX/);
    expect(output).toMatch(/warn name/);
    expect(output).toMatch(/warn message/);
  });

  it('logs object message (debug)', async () => {
    const logger = createLogger({
      name: 'hps-logger',
      thresholdLevel: LogLevel.Verbose,
    })
      .use(createConsolePlugin({ noColor: true }))
      .build();

    await logger.debug({
      prefix: 'debug prefix',
      name: 'debug name',
      message: 'debug message',
    });

    expect(mockConsoleLog).toHaveBeenCalledTimes(1);
    const output = mockConsoleLog.mock.calls[0][0];
    expect(output).toMatch(/\[ DEBUG \]/);
    expect(output).toMatch(/DEBUG PREFIX/);
    expect(output).toMatch(/debug name/);
    expect(output).toMatch(/debug message/);
  });

  it('logs object message (verbose)', async () => {
    const logger = createLogger({
      name: 'hps-logger',
      thresholdLevel: LogLevel.Verbose,
    })
      .use(createConsolePlugin({ noColor: true }))
      .build();

    await logger.verbose({
      prefix: 'verbose prefix',
      name: 'verbose name',
      message: 'verbose message',
    });

    expect(mockConsoleLog).toHaveBeenCalledTimes(1);
    const output = mockConsoleLog.mock.calls[0][0];
    expect(output).toMatch(/\[ VERBOSE \]/);
    expect(output).toMatch(/VERBOSE PREFIX/);
    expect(output).toMatch(/verbose name/);
    expect(output).toMatch(/verbose message/);
  });

  it('logs error with stack', async () => {
    const logger = createLogger({
      name: 'hps-logger',
      thresholdLevel: LogLevel.Verbose,
    })
      .use(createConsolePlugin({ noColor: true }))
      .build();

    let error: Error;
    try {
      throw new Error('error message');
    } catch (e) {
      error = e as Error;
    }
    await logger.error({
      name: 'error name',
      message: error!.message,
      stack: error!.stack,
    });

    expect(mockConsoleLog).toHaveBeenCalledTimes(1);
    const output = mockConsoleLog.mock.calls[0][0];
    expect(output).toMatch(/\[ ERROR \]/);
    expect(output).toMatch(/error name/);
    expect(output).toMatch(/error message/);
    expect(output).toMatch(/at /); // stack trace
  });
});
