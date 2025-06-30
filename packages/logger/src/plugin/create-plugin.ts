import type { LoggerContext } from '../types/type-logger-builder.js';
import type { LoggerMessage, LoggerPlugin } from '../types/type-plugin.js';
import { definePlugin } from './define-plugin.js';

export const createPlugin = <
  PluginOptions extends object,
  Context extends LoggerContext = LoggerContext,
  Message extends LoggerMessage = LoggerMessage,
>(
  plugin: LoggerPlugin<Context, Message>,
  _: PluginOptions
) => {
  return definePlugin<Context, Message>(plugin);
};
