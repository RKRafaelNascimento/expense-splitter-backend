export interface IFileService {
  uploadFile({
    bucketName,
    fileName,
    filePath,
    mimeType,
  }: IFileUpload): Promise<{ url: string }>;
  downloadFile(bucketName: string, fileKey: string): Promise<string>;
  deleteFile(bucketName: string, fileKey: string): Promise<void>;
}

export interface IFileUpload {
  filePath: string;
  fileName: string;
  mimeType: string;
  bucketName: string;
}
