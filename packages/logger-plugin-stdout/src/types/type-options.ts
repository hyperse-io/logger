import type { LogLevel } from '@hyperse/logger';
import type { Color } from './type-color.js';

export type StdoutOptions = {
  /**
   * If true, the plugin will be disabled
   * @default false
   */
  disable?: boolean;

  /**
   * If true, the logger name will be shown
   * @default false
   */
  showLoggerName?: boolean;

  /**
   * If true, the logger name will be capitalized
   * @default false
   */
  capitalizeLoggerName?: boolean;

  /**
   * If true, the plugin name will be shown
   * @default false
   */
  showPluginName?: boolean;

  /**
   * If true, the plugin name will be capitalized
   * @default false
   */
  capitalizePluginName?: boolean;

  /**
   * If true, the prefix will be shown
   * @default true
   */
  showPrefix?: boolean;

  /**
   * If true, each message logged to the terminal will have the name of the level of the message attached to it.
   *
   * `[ FATAL ] WHAT WILL I DO?!`
   *
   * @default false
   */
  showLevelName?: boolean;

  /**
   * If true, the level name will be capitalized
   * @default false
   */
  capitalizeLevelName?: boolean;

  /**
   * If true, each message logged to the terminal will have a date corresponding to when the message was logged attached to it.
   *
   * `[ 2025-7-1 ] foo`
   * @default false
   */
  showDate?: boolean;

  /**
   * If true, each message logged to the terminal will have a timestamp corresponding to the exact time the message was logged.
   *
   * `[ 13:43:10.23 ] bar`
   * @default false
   */
  showTimestamp?: boolean;

  /**
   * If true, the timestamp on each message logged to the stdout will be displayed using the 24 hour clock instead of the 12 hour clock. Keep in mind that the timestamp of when a log was logged to the stdout is only displayed when `showTimestamp` is also true.
   *
   * ### **24 hour clock:**
   *
   * `[ 13:27:55.33 ] pow`
   *
   * ### **12 hour clock:**
   *
   * `[ 1:27:55.33 PM ] pow`
   * @default false
   */
  use24HourClock?: boolean;

  /**
   * Whether or not to show a cool arrow before a log's message.
   *
   * `>> baz`
   * @default false
   */
  showArrow?: boolean;

  /**
   * Removes colors from the stdout writing
   * @default false
   */
  noColor?: boolean;

  /**
   * The color of the level of the message
   * @default {
   *   [LogLevel.Error]: 'red',
   *   [LogLevel.Warn]: 'yellow',
   *   [LogLevel.Info]: 'green',
   *   [LogLevel.Debug]: 'blue',
   *   [LogLevel.Verbose]: 'magenta',
   * }
   */
  levelColor?: { [key in LogLevel]?: Color[] };

  /**
   * The color of the prefix
   * @default ['bold', 'magenta']
   */
  prefixColor?: Color[];

  /**
   * The color of the logger name
   * @default ['bold', 'magenta']
   */
  loggerNameColor?: Color[];

  /**
   * The color of the plugin name
   * @default ['bold', 'magenta']
   */
  pluginNameColor?: Color[];
};
