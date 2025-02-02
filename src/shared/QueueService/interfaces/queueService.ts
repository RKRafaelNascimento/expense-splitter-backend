import { Message } from "@aws-sdk/client-sqs";

export interface IQueueService {
  send(message: string): Promise<{ MessageId?: string }>;
  consume(maxMessages: number, waitTimeSeconds: number): Promise<Message[]>;
  delete(receiptHandle: string): Promise<void>;
}
