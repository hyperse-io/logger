import type { LogLevel } from '@hyperse/logger';
import type { Color } from './type-color.js';

export type StdoutPluginContext = object;

export type LevelData = {
  /**
   * Any ANSI colors/formats which you want any messages logged to this level to have their timestamps highlighted in.
   */
  color: Color[];

  /**
   * The name of this level.
   */
  name: string;

  /**
   * The level of the message.
   */
  level: LogLevel;
};
