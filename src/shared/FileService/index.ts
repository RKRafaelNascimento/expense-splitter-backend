import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { awsConfig } from "@/config";
import fs from "fs";
import { IFileService, IFileUpload } from "./interfaces";
import { Logger } from "../Logger";
import { ILogger } from "../Logger/interfaces";

export class FileService implements IFileService {
  private s3Client: S3Client;
  private logger: ILogger = Logger.getInstance();

  constructor() {
    this.s3Client = new S3Client({
      ...awsConfig(),
    });
  }

  async uploadFile({
    bucketName,
    fileName,
    filePath,
    mimeType,
  }: IFileUpload): Promise<{ url: string }> {
    const fileStream = fs.createReadStream(filePath);

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: fileStream,
      ContentType: mimeType,
    });

    await this.s3Client.send(command);

    fs.unlink(filePath, (err) => {
      if (err)
        this.logger.error({ msg: `Error deleting local file: ${err.message}` });
    });

    return { url: `https://${bucketName}.s3.amazonaws.com/${fileName}` };
  }
}
