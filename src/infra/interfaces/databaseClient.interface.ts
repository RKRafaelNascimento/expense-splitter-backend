import { IDatabaseConnectionStatus } from "./databaseConnectionStatus.interface";
import { IOrmClient } from "./ormClient.interface";

export interface IDatabaseClient {
  startConnection: () => Promise<unknown | undefined>;
  closeConnection: () => Promise<void>;
  getConnectionStatus: () =>
    | Promise<IDatabaseConnectionStatus>
    | IDatabaseConnectionStatus;
  getOrmClient: () => IOrmClient;
}
