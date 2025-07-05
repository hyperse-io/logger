/**
 * LoggerMessageObject is a type that defines the log message object.
 */
export type LoggerMessageObject = {
  /**
   * The message of the log message.
   * @returns The message of the log message.
   */
  message: string | object;
  /**
   * The prefix of the log message.
   * @returns The prefix of the log message.
   */
  prefix?: string;
  /**
   * The name of the log message.
   * @returns The name of the log message.
   */
  name?: string;
  /**
   * The stack of the log message.
   * @returns The stack of the log message.
   */
  stack?: string | undefined | null;
};

/**
 * LoggerMessage is a type that defines the log message.
 */
export type LoggerMessage = string | LoggerMessageObject;

/**
 * RawLoggerMessage is a type that defines the raw log message.
 * @template Context The context type for the logger.
 * @returns The raw log message.
 */
export type RawLoggerMessage<Context extends object = object> =
  | LoggerMessage
  | ((ctx: Context) => LoggerMessage);
