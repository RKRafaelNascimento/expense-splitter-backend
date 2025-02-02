import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { awsConfig } from "@/config";
import fs from "fs";
import path from "path";
import { IFileService, IFileUpload } from "./interfaces";
import { Logger } from "../Logger";
import { ILogger } from "../Logger/interfaces";
import { pipeline } from "stream";
import { promisify } from "util";

const streamPipeline = promisify(pipeline);

export class FileService implements IFileService {
  private s3Client: S3Client;
  private logger: ILogger = Logger.getInstance();
  private tempFolder = path.join(__dirname, "../../../_temporary_folder");

  constructor() {
    this.s3Client = new S3Client({
      ...awsConfig(),
    });

    if (!fs.existsSync(this.tempFolder)) {
      fs.mkdirSync(this.tempFolder, { recursive: true });
    }
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
      if (err) {
        this.logger.error({ msg: `Error deleting local file: ${err.message}` });
      }
    });

    return { url: `https://${bucketName}.s3.amazonaws.com/${fileName}` };
  }

  async downloadFile(bucketName: string, fileKey: string): Promise<string> {
    const localFilePath = path.join(this.tempFolder, fileKey);

    try {
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
      });

      const response = await this.s3Client.send(command);
      if (!response.Body) {
        throw new Error("File stream not available in response.");
      }

      const fileStream = fs.createWriteStream(localFilePath);
      await streamPipeline(response.Body as NodeJS.ReadableStream, fileStream);

      this.logger.info({ msg: `File downloaded to ${localFilePath}` });
      return localFilePath;
    } catch (error) {
      this.logger.error({ msg: "Error downloading file:", error });
      throw error;
    }
  }

  async deleteFile(bucketName: string, fileKey: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
      });

      await this.s3Client.send(command);
      this.logger.info({ msg: `File ${fileKey} deleted from S3` });

      const localFilePath = path.join(this.tempFolder, fileKey);
      if (fs.existsSync(localFilePath)) {
        fs.unlink(localFilePath, (err) => {
          if (err) {
            this.logger.error({
              msg: `Error deleting local file: ${err.message}`,
            });
          }
        });
      }
    } catch (error) {
      this.logger.error({ msg: "Error deleting file:", error });
      throw error;
    }
  }
}
