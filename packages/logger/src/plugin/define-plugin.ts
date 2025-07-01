import type { LoggerMessage } from '@hyperse/logger-common';
import type { LoggerContext } from '../types/type-logger.js';
import type { LoggerPlugin } from '../types/type-logger-plugin.js';

type DefineConfigFn = <
  Context extends LoggerContext = LoggerContext,
  Message extends LoggerMessage = LoggerMessage,
>(
  plugin: LoggerPlugin<Context, Message>
) => LoggerPlugin<Context, Message>;

// Helper function to define a plugin, simply returns the provided plugin configuration object
export const definePlugin: DefineConfigFn = (plugin) => {
  return plugin;
};
