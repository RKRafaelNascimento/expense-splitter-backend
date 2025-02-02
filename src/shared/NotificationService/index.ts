import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { awsConfig } from "@/config";
import { Logger } from "../Logger";
import { ILogger } from "../Logger/interfaces";
import { IEmailNotification, INotificationService } from "./interfaces";

export class NotificationService implements INotificationService {
  private sesClient: SESClient;
  private logger: ILogger = Logger.getInstance();
  private senderEmail: string;

  constructor() {
    this.sesClient = new SESClient({
      ...awsConfig(),
    });

    this.senderEmail = process.env.SES_SENDER_EMAIL || "noreply@example.com";
  }

  async sendNotification(data: IEmailNotification): Promise<void> {
    try {
      const { to, body, subject } = data;
      const recipients = Array.isArray(to) ? to : [to];

      const command = new SendEmailCommand({
        Source: this.senderEmail,
        Destination: {
          ToAddresses: recipients,
        },
        Message: {
          Subject: { Data: subject },
          Body: {
            Text: { Data: JSON.stringify(body, null, 2) },
          },
        },
      });

      await this.sesClient.send(command);
      this.logger.info({
        msg: `Email sent successfully to ${recipients.join(", ")}`,
      });
    } catch (error) {
      this.logger.error({ msg: "Error sending email", error });
    }
  }
}
