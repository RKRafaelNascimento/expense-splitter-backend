export interface IAWSVariable {
  region: string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
}

export const awsConfig = (): IAWSVariable => ({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const awsBucketExpenseBatch =
  process.env.AWS_BUCKET_EXPENSE_BATCH || "expense-batch";

export const awsQueueExpenseBatch =
  process.env.AWS_QUEUE_EXPENSE_BATCH ||
  "https://sqs.us-east-1.amazonaws.com/454250076933/expense-batch";
