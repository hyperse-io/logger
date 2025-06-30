export type ConsoleOptions = {
  /**
   * Log target. A function that accepts a string
   * @default console.log
   */
  target?: (...args: any[]) => any;
  /** Show logger name */
  showLoggerName?: boolean;
  /** Show timestamp */
  showTimestamp?: boolean;
};
