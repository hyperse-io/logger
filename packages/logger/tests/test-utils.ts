import type { LoggerMessage, LoggerPluginContext } from '../src/index.js';
import { LogLevel } from '../src/index.js';

export const setUpForTest = <Context extends object>(
  ctx: LoggerPluginContext<Context>,
  level: LogLevel,
  message: LoggerMessage
) => {
  switch (level) {
    case LogLevel.Error:
      console.error(ctx.name, ctx.pluginName, level, message);
      break;
    case LogLevel.Warn:
      console.warn(ctx.name, ctx.pluginName, level, message);
      break;
    case LogLevel.Debug:
      console.debug(ctx.name, ctx.pluginName, level, message);
      break;
    case LogLevel.Info:
      console.info(ctx.name, ctx.pluginName, level, message);
      break;
    case LogLevel.Verbose:
      console.log(ctx.name, ctx.pluginName, level, message);
      break;
  }
};

export async function sleep(ms = 1000) {
  return await new Promise<void>((resolver) => {
    setTimeout(resolver, ms);
  });
}
