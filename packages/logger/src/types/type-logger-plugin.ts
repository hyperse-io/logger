import type {
  exitPipe,
  isExitPipeValue,
  pipe,
  pipeContext,
} from '@hyperse/pipeline';
import type { LogLevel } from '../constant/log-level.js';
import type { LoggerContext } from './type-logger.js';
import type { LoggerMessage } from './type-message.js';

export type LoggerPluginContext<Context extends object> =
  LoggerContext<Context> & {
    pluginName: string;
  };

export interface LoggerPlugin<
  Context extends object,
  Message extends LoggerMessage,
> {
  name: string;
  execute(options: {
    ctx: LoggerPluginContext<Context>;
    pipe: typeof pipe;
    exitPipe: typeof exitPipe;
    pipeContext: typeof pipeContext;
    isExitPipeValue: typeof isExitPipeValue;
    priority: LogLevel;
    message: Message;
  }): void | Promise<void>;
}
