import { mergeOptions } from '@hyperse/config-loader';
import { defaultConfig } from '../constant.js';
import type { ConsoleOptions } from '../types/type-options.js';

export const mergeConsoleOptions = (
  options: Partial<ConsoleOptions> = {}
): Required<ConsoleOptions> => {
  return mergeOptions(defaultConfig, options);
};
