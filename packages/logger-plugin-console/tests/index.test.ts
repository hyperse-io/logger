import { createLogger, LogLevel } from '@hyperse/logger';
import { createConsolePlugin } from '../src/create-console-plugin.js';

describe('DEMO', () => {
  it('should render', () => {
    const logger = createLogger({
      name: 'test',
      level: LogLevel.Verbose,
    })
      .use(createConsolePlugin())
      .build();

    logger.info('Hello World');
    logger.error('Hello World');
    logger.warn('Hello World');
    logger.debug('Hello World');
    logger.verbose('Hello World');

    expect(logger.info).toHaveBeenCalledWith('Hello World');
    expect(logger.error).toHaveBeenCalledWith('Hello World');
    expect(logger.warn).toHaveBeenCalledWith('Hello World');
    expect(logger.debug).toHaveBeenCalledWith('Hello World');
    expect(logger.verbose).toHaveBeenCalledWith('Hello World');
  });
});
