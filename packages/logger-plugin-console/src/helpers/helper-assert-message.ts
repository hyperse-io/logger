import type { ConsolePluginMessage } from '../types/type-plugin.js';

export const assertMessage = (
  message: ConsolePluginMessage | string
): ConsolePluginMessage => {
  if (typeof message === 'string') {
    return {
      message,
      name: undefined,
      stack: undefined,
    };
  }
  return message;
};
