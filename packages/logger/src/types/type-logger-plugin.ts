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
 * @template Context The context type for the plugin
 */
export type LoggerPluginContext<Context extends object> =
  LoggerContext<Context> & {
    pluginName: string;
  };

/**
 * LoggerPlugin is a type that defines the interface for a logger plugin.
 * @template Context The context type for the plugin
 */
export interface LoggerPlugin<Context extends object> {
  pluginName: string;
  execute(options: {
    ctx: LoggerPluginContext<Context>;
    pipe: typeof pipe;
    exitPipe: typeof exitPipe;
    pipeContext: typeof pipeContext;
    isExitPipeValue: typeof isExitPipeValue;
    level: LogLevel;
    message: LoggerMessage;
  }): void | Promise<void>;
}
