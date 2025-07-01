import type { LoggerContext, LoggerPluginContext } from '@hyperse/logger';
import type { LoggerMessageObject } from '@hyperse/logger-common';

export type ConsolePluginContext = LoggerPluginContext<LoggerContext> & {};

export type ConsolePluginMessage = LoggerMessageObject;
