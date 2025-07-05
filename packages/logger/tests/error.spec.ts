import { createLogger } from '../src/core/create-logger.js';
import { LogLevel } from '../src/index.js';
import { definePlugin } from '../src/plugin/define-plugin.js';
import { sleep } from './test-utils.js';

describe('Logger Error Handling', () => {
  it('should handle errors thrown by plugins during log execution', async () => {
    type NewLoggerContext = {
      env: 'node' | 'browser';
    };

    const consolePlugin = definePlugin<NewLoggerContext>({
      pluginName: 'consolePlugin',
      execute(options) {
        throw new Error('console plugin error ' + options.message);
      },
    });

    const errorHandlingMock = vi.fn((error: Error) => {
      console.log('errorHandling: ', error.message);
    });

    const logger = createLogger({
      thresholdLevel: LogLevel.Verbose,
      name: 'sampleLogger',
      env: 'node',
      errorHandling: errorHandlingMock,
    })
      .use(consolePlugin)
      .build();

    logger.info('info message');
    logger.debug('debug message');
    logger.verbose('verbose message');
    logger.warn('warn message');
    logger.error('error message');

    await sleep(100);

    expect(errorHandlingMock).toHaveBeenCalledTimes(5);
    expect(errorHandlingMock.mock.calls[0][0].message).toEqual(
      'console plugin error info message'
    );
    expect(errorHandlingMock.mock.calls[1][0].message).toEqual(
      'console plugin error debug message'
    );
    expect(errorHandlingMock.mock.calls[2][0].message).toEqual(
      'console plugin error verbose message'
    );
    expect(errorHandlingMock.mock.calls[3][0].message).toEqual(
      'console plugin error warn message'
    );
    expect(errorHandlingMock.mock.calls[4][0].message).toEqual(
      'console plugin error error message'
    );
  });
});
