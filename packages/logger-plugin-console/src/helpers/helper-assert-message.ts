import type { LoggerMessageObject } from '@hyperse/logger';

export const assertMessage = <T extends LoggerMessageObject>(
  message: T | string
): T => {
  if (typeof message === 'string') {
    const newMessage = {
      message: message,
      name: undefined,
      stack: undefined,
    };
    return newMessage as T;
  }
  return message;
};
