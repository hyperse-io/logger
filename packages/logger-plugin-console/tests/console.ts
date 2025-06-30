import { createLogger, LogLevel } from '@hyperse/logger';
import { createConsolePlugin } from '../src/create-console-plugin.js';

const logger = createLogger({
  level: LogLevel.Verbose,
})
  .use(createConsolePlugin({ showTimestamp: true }))
  .build();

logger.info('info message');
logger.warn('warn message');
logger.debug('debug message');
logger.verbose('verbose message');

try {
  throw new Error('error message');
} catch (error: any) {
  logger.error({
    name: 'error name',
    message: error.message,
    stack: error.stack,
  });
}
