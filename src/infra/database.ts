import { PrismaClient } from "@prisma/client";
import { Logger } from "@/shared/Logger";
import { ILogger } from "@/shared/Logger/interfaces";
import { ComponentStatus, ConnectionStatus } from "./enums";
import { IDatabaseClient, IDatabaseConnectionStatus } from "./interfaces";

export class DatabaseClient implements IDatabaseClient {
  private static instance: IDatabaseClient;
  private prisma: PrismaClient;

  private constructor(private readonly logger: ILogger) {
    this.prisma = new PrismaClient();
  }

  public static getInstance(logger?: ILogger): IDatabaseClient {
    if (!this.instance) {
      const loggerInstance = logger || Logger.getInstance();
      this.instance = new DatabaseClient(loggerInstance);
    }

    return this.instance;
  }

  public async startConnection(): Promise<void> {
    this.logger.info({ msg: "Establishing database connection" });
    await this.prisma.$connect();
  }

  public async closeConnection(): Promise<void> {
    this.logger.info({ msg: "Closing database connection" });
    await this.prisma.$disconnect();
  }

  public async getConnectionStatus(): Promise<IDatabaseConnectionStatus> {
    try {
      this.logger.debug({ msg: "Checking database connection status" });
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: ComponentStatus.HEALTHY,
        connectionStatus: ConnectionStatus.CONNECTED,
      };
    } catch {
      return {
        status: ComponentStatus.UNHEALTHY,
        connectionStatus: ConnectionStatus.DISCONNECTED,
      };
    }
  }

  public getOrmClient(): PrismaClient {
    return this.prisma;
  }
}
