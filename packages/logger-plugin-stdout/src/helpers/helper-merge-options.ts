import { mergeOptions } from '@hyperse/logger';
import { defaultConfig } from '../constant.js';
import type { StdoutOptions } from '../types/type-options.js';

export const mergeStdOptions = (
  options: Partial<StdoutOptions> = {}
): Required<StdoutOptions> => {
  return mergeOptions(defaultConfig, options);
};
