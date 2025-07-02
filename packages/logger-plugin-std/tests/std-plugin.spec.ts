import { createLogger, LogLevel } from '@hyperse/logger';
import { createStdPlugin } from '../src/create-std-plugin.js';
import { sleep } from './test-utils.js';

describe('createStdPlugin', () => {
  let mockStdLog: ReturnType<typeof vi.spyOn<any, 'write'>>;

  beforeEach(() => {
    mockStdLog = vi
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true);
  });

  afterEach(() => {
    mockStdLog.mockRestore();
  });

  it('logs string message when disable is true', async () => {
    const logger = createLogger({
      name: 'hps-logger',
      thresholdLevel: LogLevel.Verbose,
    })
      .use(createStdPlugin({ disable: true }))
      .build();

    logger.info('info message');

    await sleep(100);

    expect(mockStdLog).not.toHaveBeenCalled();
  });

  it('logs string message (info)', async () => {
    const logger = createLogger({
      name: 'hps-logger',
      thresholdLevel: LogLevel.Verbose,
    })
      .use(createStdPlugin({ noColor: true }))
      .build();

    logger.info('info message');

    await sleep(100);

    expect(mockStdLog).toHaveBeenCalledTimes(1);
    const output = mockStdLog.mock.calls[0][0];
    expect(output).toMatch(/\[ INFO \]/);
    expect(output).toMatch(/info message/);
  });

  it('logs object message (warn)', async () => {
    const logger = createLogger({
      name: 'hps-logger',
      thresholdLevel: LogLevel.Verbose,
    })
      .use(createStdPlugin({ noColor: true }))
      .build();

    logger.warn({
      prefix: 'warn prefix',
      name: 'warn name',
      message: 'warn message',
    });

    await sleep(100);

    expect(mockStdLog).toHaveBeenCalledTimes(1);
    const output = mockStdLog.mock.calls[0][0];
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
      .use(createStdPlugin({ noColor: true }))
      .build();

    logger.debug({
      prefix: 'debug prefix',
      name: 'debug name',
      message: 'debug message',
    });

    await sleep(100);

    expect(mockStdLog).toHaveBeenCalledTimes(1);
    const output = mockStdLog.mock.calls[0][0];
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
      .use(createStdPlugin({ noColor: true }))
      .build();

    logger.verbose({
      prefix: 'verbose prefix',
      name: 'verbose name',
      message: 'verbose message',
    });

    await sleep(100);

    expect(mockStdLog).toHaveBeenCalledTimes(1);
    const output = mockStdLog.mock.calls[0][0];
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
      .use(createStdPlugin({ noColor: true }))
      .build();

    let error: Error;
    try {
      throw new Error('error message');
    } catch (e) {
      error = e as Error;
    }
    logger.error({
      name: 'error name',
      message: error!.message,
      stack: error!.stack,
    });

    await sleep(100);

    expect(mockStdLog).toHaveBeenCalledTimes(1);
    const output = mockStdLog.mock.calls[0][0];
    expect(output).toMatch(/\[ ERROR \]/);
    expect(output).toMatch(/error name/);
    expect(output).toMatch(/error message/);
    expect(output).toMatch(/at /); // stack trace
  });
});
