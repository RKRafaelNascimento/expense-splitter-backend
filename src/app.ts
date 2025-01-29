import { createServer, Server } from "http";
import express, { Application } from "express";
import { applicationConfig } from "@/config";
import { ILogger } from "@/shared/Logger/interfaces";
import { Logger } from "@/shared/Logger";

export default class App {
  private readonly application: Application;
  private server: Server;
  private hasInitialized = false;
  private static instance: App;
  private constructor(
    private port: number = applicationConfig.port,
    private readonly logger: ILogger = Logger.getInstance(),
  ) {
    this.application = express();
    this.server = createServer(this.application);
  }
  public static getInstance(): App {
    if (this.instance) return this.instance;
    this.instance = new App();
    return this.instance;
  }

  private setupGlobalMiddleware(): void {
    this.logger.info({ msg: "Initializing global middle" });
    this.application.use(express.json());
    this.application.use(express.urlencoded({ extended: false }));
  }

  public async stopApplication(): Promise<void> {
    this.logger.info({ msg: "Stopping application" });
    this.server.close();
  }
  private setupRoutes(): void {
    this.logger.info({ msg: "Initializing application routes" });
  }
  public initServer(): void {
    this.logger.info({ msg: "Initializing server" });
    this.server.listen(this.port, () => {
      this.logger.info({ msg: `Server listening on port ${this.port}` });
    });
  }
  public async initApplication(): Promise<void> {
    if (this.hasInitialized) return;
    this.hasInitialized = true;
    this.logger.info({ msg: "Initializing application" });
    this.setupGlobalMiddleware();
    this.setupRoutes();
  }
}
