import pino from "pino";

import { loggerConfig } from "@/config";
import { ILogger, ILoggerInstance, ILoggerParams } from "./interfaces";

export class Logger implements ILogger {
  private static instance: ILogger;

  private constructor(private readonly loggerInstance: ILoggerInstance) {}

  public static getInstance(logger?: ILoggerInstance): ILogger {
    if (!this.instance) {
      if (logger) {
        this.instance = new Logger(logger);
        return this.instance;
      }

      const { LOGGER_ENABLED, LOGGER_LEVEL, LOGGER_PRETTY_PRINT } =
        loggerConfig();

      if (LOGGER_PRETTY_PRINT) {
        const loggerInstance = pino({
          level: LOGGER_LEVEL,
          enabled: LOGGER_ENABLED,
          transport: {
            target: "pino-pretty",
            options: {
              colorize: true,
            },
          },
        });
        this.instance = new Logger(loggerInstance);
        return this.instance;
      }

      const loggerInstance = pino({
        level: LOGGER_LEVEL,
        enabled: LOGGER_ENABLED,
      });
      this.instance = new Logger(loggerInstance);
      return this.instance;
    }

    return this.instance;
  }

  public info(params: ILoggerParams): void {
    this.loggerInstance.info(params);
  }

  public fatal(params: ILoggerParams): void {
    this.loggerInstance.fatal(params);
  }

  public trace(params: ILoggerParams): void {
    this.loggerInstance.trace(params);
  }

  public error(params: ILoggerParams): void {
    this.loggerInstance.error(params);
  }

  public warning(params: ILoggerParams): void {
    this.loggerInstance.warn(params);
  }

  public debug(params: ILoggerParams): void {
    this.loggerInstance.debug(params);
  }
}
