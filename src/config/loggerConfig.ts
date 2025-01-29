enum ILoggerLevel {
  trace = "trace",
  debug = "debug",
  info = "info",
  warn = "warn",
  error = "error",
  fatal = "fatal",
}

interface ILoggerVariable {
  LOGGER_LEVEL: ILoggerLevel;
  LOGGER_ENABLED: boolean;
  LOGGER_PRETTY_PRINT: boolean;
}

export const loggerConfig = (): ILoggerVariable => ({
  LOGGER_LEVEL:
    (process.env.LOGGER_LEVEL as ILoggerLevel) || ILoggerLevel.debug,
  LOGGER_ENABLED: process.env.LOGGER_ENABLED === "true",
  LOGGER_PRETTY_PRINT: process.env.LOGGER_PRETTY_PRINT === "true",
});
