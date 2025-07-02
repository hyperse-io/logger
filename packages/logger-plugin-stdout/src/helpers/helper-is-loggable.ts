import type { LoggerContext, LogLevel } from '@hyperse/logger';
import type { StdoutPluginContext } from '../types/type-plugin.js';

export const isLoggable = (
  ctx: LoggerContext<StdoutPluginContext>,
  level: LogLevel
) => {
  return ctx.thresholdLevel >= level;
};
