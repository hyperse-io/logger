/**
 * LoggerMessageObject is a type that defines the log message object.
 */
export type LoggerMessageObject = {
  message: string | object;
  prefix?: string;
  name?: string;
  stack?: string | undefined | null;
};

/**
 * LoggerMessage is a type that defines the log message.
 */
export type LoggerMessage = string | LoggerMessageObject;

/**
 * RawLoggerMessage is a type that defines the raw log message.
 * @template Context The context type for the logger
 */
export type RawLoggerMessage<Context extends object = object> =
  | LoggerMessage
  | ((ctx: Context) => LoggerMessage);
