export interface IFileService {
  uploadFile({
    bucketName,
    fileName,
    filePath,
    mimeType,
  }: IFileUpload): Promise<{ url: string }>;
}

export interface IFileUpload {
  filePath: string;
  fileName: string;
  mimeType: string;
  bucketName: string;
}
