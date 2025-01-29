import { ILoggerParams } from "./loggerParams.interface";

export interface ILogger {
  info(logParams: ILoggerParams): void;
  error(logParams: ILoggerParams): void;
  fatal(logParams: ILoggerParams): void;
  trace(logParams: ILoggerParams): void;
  debug(logParams: ILoggerParams): void;
  warning(logParams: ILoggerParams): void;
}
