import colors from 'picocolors';
import {
  type LoggerContext,
  type LoggerMessage,
  LogLevel,
} from '../../../logger/src/index.js';
import type { Color } from '../types/type-color.js';
import type { ConsoleOptions } from '../types/type-options.js';
import { formatStack } from './helper-format-stack.js';

const TextColors: Record<LogLevel, Color> = {
  [LogLevel.Error]: 'red',
  [LogLevel.Warn]: 'yellow',
  [LogLevel.Info]: 'green',
  [LogLevel.Debug]: 'blue',
  [LogLevel.Verbose]: 'magenta',
};

export const createFormatter = (
  ctx: LoggerContext,
  level: LogLevel,
  options: ConsoleOptions = {}
) => {
  const { name } = ctx;
  const {
    showTimestamp = true,
    showLoggerName = true,
    target = console.log,
  } = options;
  const textColor = colors[TextColors[level]];

  let messageStr = ``;

  if (showLoggerName) {
    messageStr += `[${name}] `;
  }

  if (showTimestamp) {
    messageStr += `${new Date().toISOString()} `;
  }

  function print(inputMessage: LoggerMessage) {
    const { message, name, stack } = inputMessage;
    if (name) {
      messageStr += `${textColor(name)}: `;
    }
    if (message) {
      messageStr += `${textColor(JSON.stringify(message))} `;
    }
    if (stack) {
      messageStr += `${textColor(formatStack(stack))}`;
    }
    target(messageStr);
  }

  return {
    print,
  };
};
