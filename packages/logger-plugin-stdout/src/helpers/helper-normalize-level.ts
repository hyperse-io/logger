import { LogLevel } from '@hyperse/logger';
import { defaultLevelColor } from '../constant.js';
import type { StdoutOptions } from '../types/type-options.js';
import type { LevelData } from '../types/type-plugin.js';

export const normalizeLevelData = (
  level: LogLevel,
  options: Required<StdoutOptions>
): LevelData => {
  const { levelColor } = options;
  const currentLevelColor = levelColor[level] ?? defaultLevelColor[level];
  const levelName = LogLevel[level];
  return {
    color: currentLevelColor,
    name: levelName,
    level,
  };
};
