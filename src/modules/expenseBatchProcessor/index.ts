import { Logger } from "@/shared/Logger";
import { ExpenseBatchProcessorFactory } from "./expenseBatchProcessorFactory";

const logger = Logger.getInstance();

async function startConsumer() {
  try {
    logger.info({ msg: "Starting consumer process..." });
    const interval = 10000;

    setInterval(async () => {
      await ExpenseBatchProcessorFactory.getInstance().processQueue();
    }, interval);

    logger.info({ msg: "Consumer started successfully" });
  } catch (error) {
    logger.error({ msg: "Consumer started successfully", error });
  }
}

startConsumer();
