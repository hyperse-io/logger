import { LogLevel } from '@hyperse/logger';
import type { ConsoleOptions } from './types/type-options.js';

export const defaultLevelColor: Record<LogLevel, string> = {
  [LogLevel.Error]: 'color:red;',
  [LogLevel.Warn]: 'color:yellow;',
  [LogLevel.Info]: 'color:blue;',
  [LogLevel.Debug]: 'color:magenta;',
  [LogLevel.Verbose]: 'color:magenta;',
};

export const defaultPrefixColor: string = 'color: magenta; font-weight: bold;';
export const defaultLoggerNameColor: string = 'color: cyan; font-weight: bold;';
export const defaultPluginNameColor: string = 'color: cyan; font-weight: bold;';

export const defaultConfig: Required<ConsoleOptions> = {
  disable: false,
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
