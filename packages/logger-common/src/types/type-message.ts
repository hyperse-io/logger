export type LoggerMessageObject = {
  message: string | object;
  prefix?: string;
  name?: string;
  stack?: string | undefined | null;
};

export type LoggerMessage = string | LoggerMessageObject;
