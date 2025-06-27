import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

/**
 * Get the directory name of a file
 * @param url - The URL of the file
 * @param paths - The paths to join with the directory name
 * @returns The directory name
 */
export const getDirname = (url: string, ...paths: string[]) => {
  return join(dirname(fileURLToPath(url)), ...paths);
};
