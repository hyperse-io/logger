import type { LoggerContext, LogLevel } from '@hyperse/logger';
import type { ConsolePluginContext } from '../types/type-plugin.js';

export const isLoggable = (
  ctx: LoggerContext<ConsolePluginContext>,
  level: LogLevel
) => {
  return ctx.thresholdLevel >= level;
};
