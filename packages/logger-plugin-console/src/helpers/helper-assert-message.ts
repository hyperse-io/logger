import type { LoggerMessageObject } from '@hyperse/logger';

export const assertMessage = <T extends LoggerMessageObject>(
  message: T | string
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
