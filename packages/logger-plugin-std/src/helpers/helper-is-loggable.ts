import type { LoggerContext, LogLevel } from '@hyperse/logger';
import type { StdPluginContext } from '../types/type-plugin.js';

export const isLoggable = (
  ctx: LoggerContext<StdPluginContext>,
  level: LogLevel
) => {
  return ctx.thresholdLevel >= level;
};
