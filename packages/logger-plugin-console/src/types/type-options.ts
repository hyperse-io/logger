import type { LogLevel } from '@hyperse/logger-common';
import type { Color } from './type-color.js';

export type ConsoleOptions = {
  /**
   * Show logger name
   * @default false
   */
  showLoggerName?: boolean;

  /**
   * Show plugin name
   * @default false
   */
  showPluginName?: boolean;

  /**
   * Show prefix
   * @default false
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
   * `[ 12d/5m/2011y ] foo`
   * @default false
   */
  showDate?: boolean;

  /**
   * If true, the date displayed on each message logged to the console will have the month before the day. Keep in mind that the date of when a log was logged to the console is only displayed when `showDate` is also true.
   *
   * ### **Day before month:**
   *
   * `[ 20d/12m/1999y ] loy`
   *
   * ### **Month before day:**
   *
   * `[ 12m/20d/1999y ] loy`
   * @default false
   */
  showMonthBeforeDay?: boolean;

  /**
   * If true, each message logged to the terminal will have a timestamp relative to the creation of this particular instance of the `Terminal` class.
   *
   * `[ 5y 1m 15h 51min 7s 300ms ] A long time has passed.`
   * @default false
   */
  showRelativeTimestamp?: boolean;

  /**
   * If true, each message logged to the terminal will have a timestamp corresponding to the exact time the message was logged.
   *
   * `[ 13:43:10.23 ] bar`
   * @default false
   */
  showTimestamp?: boolean;

  /**
   * If true, each message logged to the terminal will have a timestamp relative to when the previous message was logged to the terminal.
   *
   * `[ +31min +5s +903ms ] It took forever!`
   * @default false
   */
  showTimestampRelativeToLastLog?: boolean;

  /**
   * If true, the timestamp on each message logged to the console will be displayed using the 24 hour clock instead of the 12 hour clock. Keep in mind that the timestamp of when a log was logged to the console is only displayed when `showTimestamp` is also true.
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
   * Removes colors from the console output
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
   * The color of the context
   * @default ['bold', 'magenta']
   */
  prefixColor?: Color[];
};
