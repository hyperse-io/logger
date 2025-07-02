import type { LoggerMessageObject } from '@hyperse/logger';

export const assertMessage = (
  message: LoggerMessageObject | string
): LoggerMessageObject => {
  if (typeof message === 'string') {
    return {
      message: message,
      name: undefined,
      stack: undefined,
    };
  }
  return message;
};
