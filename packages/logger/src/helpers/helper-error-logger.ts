import { defaultErrorLoggerName } from '../constant/constant.js';
import { definePlugin } from '../plugin/define-plugin.js';
import type { LoggerContext } from '../types/type-logger-builder.js';
import type { LoggerMessage } from '../types/type-plugin.js';

export const createErrorLogger = <
  Context extends LoggerContext,
  Message extends LoggerMessage,
>() => {
  return definePlugin<Context, Message>({
    name: defaultErrorLoggerName,
    setup(ctx, __, message) {
      console.error('error', ctx.pluginName, message.message);
    },
  });
};
