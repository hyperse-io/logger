import type { LoggerPluginContext, LogLevel } from '@hyperse/logger';
import type { ConsoleOptions } from '../types/type-options.js';
import type {
  ConsolePluginContext,
  ConsolePluginMessage,
} from '../types/type-plugin.js';
import { colorApplier } from './helper-color-applier.js';
import { formatStack } from './helper-format-stack.js';
import { normalizeLevelData } from './helper-normalize-level.js';
import { strTimePad } from './helper-str-pad.js';

export const formatMessage = (formatOptions: {
  ctx: LoggerPluginContext<ConsolePluginContext>;
  level: LogLevel;
  inputMessage: ConsolePluginMessage;
  options: Required<ConsoleOptions>;
}) => {
  const { ctx, level, inputMessage, options } = formatOptions;
  const { name: loggerName, pluginName } = ctx;
  const { message, name: messageName, stack, prefix } = inputMessage;
  const {
    showLoggerName,
    capitalizeLoggerName,
    showPluginName,
    capitalizePluginName,
    showPrefix,
    showLevelName,
    capitalizeLevelName,
    showDate,
    showTimestamp,
    use24HourClock,
    showArrow,
    noColor,
    prefixColor,
    loggerNameColor,
    pluginNameColor,
  } = options;

  const time = new Date();
  let output = '';
  const { color: levelColor, name: levelName } = normalizeLevelData(
    level,
    options
  );

  const color = colorApplier(noColor);
  const context: string[] = [];
  const colors: string[] = [];

  // date and timestamp
  if (showDate || showTimestamp) {
    output += '[';
    if (showDate) {
      output +=
        ' ' +
        color(
          `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`
        ) +
        ' ';
      colors.push(levelColor, 'color:inherit;');
    }

    if (showDate && showTimestamp) {
      output += '|';
    }

    if (showTimestamp) {
      const hours = time.getHours();

      output +=
        ' ' +
        color(
          `${strTimePad(
            use24HourClock || !(hours >= 13 || hours === 0)
              ? hours
              : Math.abs(hours - 12)
          )}:${strTimePad(time.getMinutes())}:${strTimePad(time.getSeconds())}` +
            ' ' +
            (use24HourClock ? '' : hours >= 13 ? 'PM' : 'AM' + ' ')
        );
      colors.push(levelColor, 'color:inherit;');
    }

    output += '] ';
  }

  // level name
  if (showLevelName) {
    output +=
      '[ ' +
      color(capitalizeLevelName ? levelName.toUpperCase() : levelName) +
      ' ] ';
    colors.push(levelColor, 'color:inherit;');
  }

  // prefix
  if (showPrefix && prefix) {
    context.push(' ' + color(prefix.toUpperCase()) + ' ');
    colors.push(prefixColor, 'color:inherit;');
  }

  // logger name
  if (showLoggerName && loggerName) {
    context.push(
      ' ' +
        color(capitalizeLoggerName ? loggerName.toUpperCase() : loggerName) +
        ' '
    );
    colors.push(loggerNameColor, 'color:inherit;');
  }

  // plugin name
  if (showPluginName && pluginName) {
    context.push(
      ' ' +
        color(capitalizePluginName ? pluginName.toUpperCase() : pluginName) +
        ' '
    );
    colors.push(pluginNameColor, 'color:inherit;');
  }

  // level context
  if (context.length) {
    output += '[' + context.join(':') + '] ';
  }

  // arrow
  if (showArrow) {
    output += ' >> ';
  }

  // message name
  if (messageName) {
    output += `${messageName} `;
  }

  // message
  if (message) {
    output += `${message} `;
  }

  // stack
  if (stack) {
    output += color(formatStack(stack));
    colors.push('color:red;', 'color:inherit;');
  }

  if (noColor) {
    return [output];
  }
  return [output, ...colors];
};
