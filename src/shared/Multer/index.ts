import multer, { StorageEngine } from "multer";
import path from "path";
import fs from "fs";
import { Request, Response } from "express";

export class MulterConfig {
  private static tempDir: string = path.join(
    __dirname,
    "../../../_temporary_folder",
  );

  constructor() {
    this.ensureTempDirExists();
  }

  private ensureTempDirExists(): void {
    if (!fs.existsSync(MulterConfig.tempDir)) {
      fs.mkdirSync(MulterConfig.tempDir, { recursive: true });
    }
  }

  private storage(): StorageEngine {
    return multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, MulterConfig.tempDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${uniqueSuffix}-${file.originalname}`);
      },
    });
  }

  private fileFilter(
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback,
    res: Response,
  ): void {
    if (file.mimetype === "text/csv") {
      cb(null, true);
    } else {
      res.status(400).json({
        code: "INVALID_FILE_TYPE",
        statusCode: 400,
        statusCodeAsString: "BAD_REQUEST",
        description: "Only CSV files are allowed",
      });
    }
  }

  /**
   * Supports files up to 100MB
   */

  public getUploader() {
    return multer({
      storage: this.storage(),
      fileFilter: (req, file, cb) => {
        this.fileFilter(req, file, cb, req.res as Response);
      },
      limits: { fileSize: 100 * 1024 * 1024 },
    });
  }
}

export const upload = new MulterConfig().getUploader();
