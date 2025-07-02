import { mergeOptions } from '@hyperse/logger';
import { defaultConfig } from '../constant.js';
import type { StdOptions } from '../types/type-options.js';

export const mergeStdOptions = (
  options: Partial<StdOptions> = {}
): Required<StdOptions> => {
  return mergeOptions(defaultConfig, options);
};
