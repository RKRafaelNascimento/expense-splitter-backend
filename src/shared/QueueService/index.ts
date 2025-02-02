import {
  SQSClient,
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  Message,
} from "@aws-sdk/client-sqs";
import { Logger } from "../Logger";
import { IQueueService } from "./interfaces";
import { IAWSVariable } from "@/config/awsConfig";

export class QueueService implements IQueueService {
  private Logger = Logger.getInstance();
  private sqsClient: SQSClient;
  constructor(
    private config: IAWSVariable,
    private queueUrl: string,
  ) {
    this.sqsClient = new SQSClient({ ...this.config });
    this.queueUrl = queueUrl;
  }

  async send(message: string): Promise<{ MessageId?: string }> {
    try {
      const command = new SendMessageCommand({
        MessageBody: message,
        QueueUrl: this.queueUrl,
      });

      const response = await this.sqsClient.send(command);
      this.Logger.info({ msg: `Message sent: ${response.MessageId}` });

      return { MessageId: response.MessageId };
    } catch (error) {
      this.Logger.error({ msg: "Error sending message:", error });
      throw error;
    }
  }

  async consume(
    maxMessages: number = 1,
    waitTimeSeconds: number = 60,
  ): Promise<Message[]> {
    try {
      const command = new ReceiveMessageCommand({
        QueueUrl: this.queueUrl,
        MaxNumberOfMessages: maxMessages,
        WaitTimeSeconds: waitTimeSeconds,
      });

      const response = await this.sqsClient.send(command);
      return response.Messages || [];
    } catch (error) {
      this.Logger.error({ msg: "Error receiving messages:", error });
      throw error;
    }
  }

  async delete(receiptHandle: string): Promise<void> {
    try {
      const command = new DeleteMessageCommand({
        QueueUrl: this.queueUrl,
        ReceiptHandle: receiptHandle,
      });

      await this.sqsClient.send(command);
    } catch (error) {
      this.Logger.error({ msg: "Error deleting message:", error });
      throw error;
    }
  }
}
