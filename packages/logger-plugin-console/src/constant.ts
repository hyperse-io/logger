import { LogLevel } from '@hyperse/logger';
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
export const defaultLoggerNameColor: Color[] = ['bold', 'cyan'];
export const defaultPluginNameColor: Color[] = ['bold', 'cyan'];

export const defaultConfig: Required<ConsoleOptions> = {
  showTimestamp: true,
  showLoggerName: false,
  capitalizeLoggerName: false,
  showPluginName: false,
  capitalizePluginName: false,
  showPrefix: true,
  showLevelName: true,
  capitalizeLevelName: true,
  showDate: false,
  use24HourClock: true,
  showArrow: false,
  noColor: false,
  levelColor: defaultLevelColor,
  prefixColor: defaultPrefixColor,
  loggerNameColor: defaultLoggerNameColor,
  pluginNameColor: defaultPluginNameColor,
};
