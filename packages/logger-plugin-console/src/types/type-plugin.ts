import type { LogLevel } from '@hyperse/logger';

export type ConsolePluginContext = object;

export type LevelData = {
  /**
   * Any ANSI colors/formats which you want any messages logged to this level to have their timestamps highlighted in.
   */
  color: string;

  /**
   * The name of this level.
   */
  name: string;

  /**
   * The level of the message.
   */
  level: LogLevel;
};
