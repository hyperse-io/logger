import type { LoggerMessage } from '../types/type-plugin.js';

export const formatMessage = <Message extends string | LoggerMessage>(
  inputMsg: Message
): {
  message: LoggerMessage;
} => {
  let message: LoggerMessage;
  if (typeof inputMsg === 'string') {
    message = { message: inputMsg };
  } else {
    message = inputMsg;
  }
  return {
    message,
  };
};
