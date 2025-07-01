import type { LogLevel } from '@hyperse/logger-common';
import { defaultLevelColor } from '../constant.js';
import type { ConsoleOptions } from '../types/type-options.js';
import type {
  ConsolePluginContext,
  ConsolePluginMessage,
} from '../types/type-plugin.js';
import { formatStack } from './helper-format-stack.js';
import { getColorApplier } from './helper-get-color-applier.js';

export const formatMessage = (
  ctx: ConsolePluginContext,
  level: LogLevel,
  inputMessage: ConsolePluginMessage,
  options: Required<ConsoleOptions>
) => {
  const time = new Date();
  const { name: loggerName, pluginName } = ctx;
  const { message, name, stack, prefix } = inputMessage;
  const {
    showLoggerName,
    showPluginName,
    showPrefix,
    showLevelName,
    capitalizeLevelName,
    showDate,
    showMonthBeforeDay,
    showRelativeTimestamp,
    showTimestamp,
    showTimestampRelativeToLastLog,
    use24HourClock,
    noColor,
    levelColor,
    prefixColor,
  } = options;

  const currentLevelColor = levelColor[level] ?? defaultLevelColor[level];

  const color = getColorApplier('COLOR', currentLevelColor, noColor);
  const decorate = getColorApplier('DECORATION', currentLevelColor, noColor);

  const levelContext: string[] = [];
  // Should add context if we have.
  if (showPrefix && prefix) {
    const ctxColor = getColorApplier('COLOR', prefixColor, noColor);
    levelContext.push(' ' + ctxColor(prefix.toUpperCase()) + ' ');
  }

  // Should look like: [ ERROR ] or [ error ]
  if (showLevelName) {
    // levelContext.push(
    //   color(
    //     ' ' +
    //       decorate(
    //         capitalizeLevelName ? level.name.toUpperCase() : level.name
    //       ) +
    //       ' '
    //   )
    // );
  }

  let messageStr = ``;

  if (showLoggerName) {
    messageStr += `[${name}] `;
  }

  if (showTimestamp) {
    messageStr += `${new Date().toISOString()} `;
  }
  if (name) {
    messageStr += `${color(name)}: `;
  }
  if (message) {
    messageStr += `${color(JSON.stringify(message))} `;
  }
  if (stack) {
    messageStr += `${color(formatStack(stack))}`;
  }
  return messageStr;
};
