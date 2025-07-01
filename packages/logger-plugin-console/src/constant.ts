import { LogLevel } from '@hyperse/logger-common';
import type { Color } from './types/type-color.js';
import type { ConsoleOptions } from './types/type-options.js';

export const defaultLevelColor: Record<LogLevel, Color[]> = {
  [LogLevel.Error]: ['red'],
  [LogLevel.Warn]: ['yellow'],
  [LogLevel.Info]: ['green'],
  [LogLevel.Debug]: ['blue'],
  [LogLevel.Verbose]: ['magenta'],
};

export const defaultPrefixColor: Color[] = ['bold', 'magenta'];

export const defaultConfig: Required<ConsoleOptions> = {
  showTimestamp: false,
  showLoggerName: false,
  showPluginName: false,
  showPrefix: false,
  showLevelName: false,
  capitalizeLevelName: false,
  showDate: false,
  showMonthBeforeDay: false,
  showRelativeTimestamp: false,
  showTimestampRelativeToLastLog: false,
  use24HourClock: false,
  noColor: false,
  levelColor: defaultLevelColor,
  prefixColor: defaultPrefixColor,
};
