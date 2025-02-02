export interface INotificationService {
  sendNotification(data: IEmailNotification): Promise<void>;
}

export interface IEmailNotification {
  to: string;
  subject: string;
  body: object;
}
