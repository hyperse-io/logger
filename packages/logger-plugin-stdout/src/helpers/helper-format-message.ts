import type {
  LoggerMessageObject,
  LoggerPluginContext,
  LogLevel,
} from '@hyperse/logger';
import type { StdoutOptions } from '../types/type-options.js';
import type { StdoutPluginContext } from '../types/type-plugin.js';
import { getColorApplier, terminalColor } from './helper-color-applier.js';
import { formatStack } from './helper-format-stack.js';
import { normalizeLevelData } from './helper-normalize-level.js';
import { strTimePad } from './helper-str-pad.js';

export const formatMessage = (formatOptions: {
  ctx: LoggerPluginContext<StdoutPluginContext>;
  level: LogLevel;
  inputMessage: LoggerMessageObject;
  options: Required<StdoutOptions>;
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
  const levelData = normalizeLevelData(level, options);

  const color = getColorApplier('COLOR', levelData.color, noColor);
  const decorate = getColorApplier('DECORATION', levelData.color, noColor);
  const context: string[] = [];

  // date and timestamp
  if (showDate || showTimestamp) {
    output += '[';
    if (showDate) {
      output += color(
        ' ' +
          decorate(
            `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`
          ) +
          ' '
      );
    }

    if (showDate && showTimestamp) {
      output += '|';
    }

    if (showTimestamp) {
      const hours = time.getHours();

      output += color(
        ' ' +
          decorate(
            `${strTimePad(
              use24HourClock || !(hours >= 13 || hours === 0)
                ? hours
                : Math.abs(hours - 12)
            )}:${strTimePad(time.getMinutes())}:${strTimePad(time.getSeconds())}`
          ) +
          ' ' +
          (use24HourClock ? '' : decorate(hours >= 13 ? 'PM' : 'AM') + ' ')
      );
    }

    output += '] ';
  }

  // level name
  if (showLevelName) {
    output +=
      '[ ' +
      color(
        capitalizeLevelName ? levelData.name.toUpperCase() : levelData.name
      ) +
      ' ] ';
  }

  // prefix
  if (showPrefix && prefix) {
    const ctxColor = getColorApplier('COLOR', prefixColor, noColor);
    context.push(' ' + ctxColor(prefix.toUpperCase()) + ' ');
  }

  // logger name
  if (showLoggerName && loggerName) {
    const ctxColor = getColorApplier('COLOR', loggerNameColor, noColor);
    context.push(
      ' ' +
        ctxColor(capitalizeLoggerName ? loggerName.toUpperCase() : loggerName) +
        ' '
    );
  }

  // plugin name
  if (showPluginName && pluginName) {
    const ctxColor = getColorApplier('COLOR', pluginNameColor, noColor);
    context.push(
      ' ' +
        ctxColor(capitalizePluginName ? pluginName.toUpperCase() : pluginName) +
        ' '
    );
  }

  // level context
  if (context.length) {
    output += '[' + context.join(':') + '] ';
  }

  // arrow
  if (showArrow) {
    output += ` ${terminalColor(['bold'])('>>')} `;
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
    output += `${formatStack(stack)}`;
  }

  return output.endsWith('\n') ? output : output + '\n';
};
