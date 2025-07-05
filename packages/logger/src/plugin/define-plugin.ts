import type { LoggerPlugin } from '../types/type-logger-plugin.js';

type DefineConfigFn = <Context extends object = object>(
  plugin: LoggerPlugin<Context>
) => LoggerPlugin<Context>;

/**
 * Helper function to define a plugin, simply returns the provided plugin configuration object
 * @param plugin The plugin to define
 * @returns The plugin configuration object
 */
export const definePlugin: DefineConfigFn = (plugin) => {
  return plugin;
};
