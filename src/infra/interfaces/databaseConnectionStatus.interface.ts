import { ComponentStatus, ConnectionStatus } from "../enums";

export interface IDatabaseConnectionStatus {
  status: ComponentStatus;
  connectionStatus: ConnectionStatus;
}
