import App from "./app";
import { Logger } from "./shared/Logger";

const logger = Logger.getInstance();

enum ExitedStatus {
  FAILURE = 1,
  SUCCESS = 0,
}

process.on("unhandledRejection", (reason, promise) => {
  logger.error({
    msg: `App exiting due to an unhandled promaaaaise: ${promise} and reason:`,
  });
  throw reason;
});

process.on("uncaughtException", (error) => {
  logger.error({ msg: `App exiting due to an uncaught expection: ${error}` });
  process.exit(ExitedStatus.FAILURE);
});

export default async function startServer(): Promise<App> {
  try {
    const app = App.getInstance();
    await app.initApplication();
    app.initServer();
    const exitSignals: NodeJS.Signals[] = ["SIGINT", "SIGTERM", "SIGQUIT"];
    exitSignals.forEach((signal: string) => {
      process.on(signal, async (): Promise<void> => {
        try {
          await app.stopApplication();
          logger.info({ msg: "App exited with success" });
          process.exit(ExitedStatus.SUCCESS);
        } catch (error) {
          logger.error({ msg: "App exited with error", error });
          process.exit(ExitedStatus.FAILURE);
        }
      });
    });
    return app;
  } catch (error) {
    logger.error({ msg: `App exited with error: ${error}` });
    process.exit(ExitedStatus.FAILURE);
  }
}

startServer();
