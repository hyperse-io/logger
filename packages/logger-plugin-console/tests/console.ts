import { createLogger } from '@hyperse/logger';
import { LogLevel } from '@hyperse/logger';
import { createConsolePlugin } from '../src/create-console-plugin.js';

const logger = createLogger({
  name: 'hps-logger',
  thresholdLevel: LogLevel.Verbose,
})
  .use(
    createConsolePlugin({
      showTimestamp: true,
      showLoggerName: true,
      capitalizeLoggerName: true,
      showPluginName: true,
      capitalizePluginName: true,
      showPrefix: true,
      showLevelName: true,
      capitalizeLevelName: true,
      showDate: true,
      use24HourClock: true,
      showArrow: true,
    })
  )
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
