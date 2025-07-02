import { createLogger } from '@hyperse/logger';
import { LogLevel } from '@hyperse/logger';
import { createStdoutPlugin } from '../src/create-stdout-plugin.js';

const logger = createLogger({
  name: 'hps-logger',
  thresholdLevel: LogLevel.Verbose,
})
  .use(createStdoutPlugin())
  .build();

logger.info('info message');

logger.warn({
  prefix: 'warn prefix',
  name: 'warn name',
  message: 'warn message',
});
logger.debug({
  prefix: 'debug prefix',
  name: 'debug name',
  message: 'debug message',
});
logger.verbose({
  prefix: 'verbose prefix',
  name: 'verbose name',
  message: 'verbose message',
});
try {
  throw new Error('error message');
} catch (error: any) {
  logger.error({
    name: 'error name',
    message: error.message,
    stack: error.stack,
  });
}
