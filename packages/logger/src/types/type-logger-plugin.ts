import type {
  exitPipe,
  isExitPipeValue,
  pipe,
  pipeContext,
} from '@hyperse/pipeline';
import type { LogLevel } from '../constant/log-level.js';
import type { LoggerContext } from './type-logger.js';
import type { LoggerMessage } from './type-message.js';

/**
 * LoggerPluginContext is a type that defines the context for a logger plugin.
 * @template Context The context type for the plugin.
 * @returns The LoggerPluginContext type.
 */
export type LoggerPluginContext<Context extends object> =
  LoggerContext<Context> & {
    /**
     * The name of the plugin.
     * @returns The name of the plugin.
     */
    pluginName: string;
  };

/**
 * LoggerPlugin is a type that defines the interface for a logger plugin.
 * @template Context The context type for the plugin.
 * @returns The LoggerPlugin type.
 */
export interface LoggerPlugin<Context extends object> {
  /**
   * The name of the plugin.
   * @returns The name of the plugin.
   */
  pluginName: string;
  /**
   * Execute the plugin.
   * @param options The options for the plugin.
   * @returns void.
   */
  execute(options: {
    /**
     * The context of the plugin.
     * @returns The context of the plugin.
     */
    ctx: LoggerPluginContext<Context>;
    /**
     * The pipe function.
     * @returns The pipe function.
     */
    pipe: typeof pipe;
    /**
     * The exitPipe function.
     * @returns The exitPipe function.
     */
    exitPipe: typeof exitPipe;
    /**
     * The pipeContext function.
     * @returns The pipeContext function.
     */
    pipeContext: typeof pipeContext;
    /**
     * The isExitPipeValue function.
     * @returns The isExitPipeValue function.
     */
    isExitPipeValue: typeof isExitPipeValue;
    /**
     * The level of the log message.
     * @returns The level of the log message.
     */
    level: LogLevel;
    /**
     * The message of the log message.
     * @returns The message of the log message.
     */
    message: LoggerMessage;
  }): void | Promise<void>;
}
