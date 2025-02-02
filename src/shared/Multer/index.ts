import multer, { StorageEngine } from "multer";
import path from "path";
import fs from "fs";
import { Request, Response, NextFunction } from "express";
import { parse } from "csv-parse";
import { multerErrorCodes } from "./error";
import { InternalServerError } from "../errors";
import { Logger } from "../Logger";

const logger = Logger.getInstance();
export class MulterConfig {
  private static MAX_CSV_LINES = 1000;
  private static REQUIRED_COLUMNS = [
    "groupId",
    "memberId",
    "memberIds",
    "name",
    "amount",
  ];
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
    if (file.mimetype !== "text/csv") {
      res.status(400).json({
        code: multerErrorCodes.INVALID_FILE_TYPE,
        statusCode: 400,
        statusCodeAsString: "BAD_REQUEST",
        description: "Only CSV files are allowed",
      });
      return;
    }

    cb(null, true);
  }

  private validateHeaders(headers: string[]): boolean {
    return MulterConfig.REQUIRED_COLUMNS.every((col) => headers.includes(col));
  }

  private async validateCsv(
    filePath: string,
    res: Response,
    cb: multer.FileFilterCallback,
  ) {
    let lineCount = 0;
    let validatedHeaders = false;
    let responseSent = false;

    try {
      const stream = fs.createReadStream(filePath);
      stream
        .pipe(
          parse({
            delimiter: ",",
            columns: (header) => {
              if (!validatedHeaders) {
                if (!this.validateHeaders(header)) {
                  stream.destroy();

                  if (fs.existsSync(filePath)) {
                    fs.unlink(filePath, (err) => {
                      if (err)
                        logger.error({
                          msg: "Error deleting file",
                          error: err,
                        });
                    });
                  }

                  if (!responseSent) {
                    responseSent = true;
                    return res.status(400).json({
                      code: multerErrorCodes.CSV_INVALID_COLUMNS,
                      statusCode: 400,
                      statusCodeAsString: "BAD_REQUEST",
                      description: `Invalid CSV columns. Expected: ${MulterConfig.REQUIRED_COLUMNS.join(", ")}`,
                    });
                  }
                }
                validatedHeaders = true;
              }
              return header;
            },
            trim: true,
          }),
        )
        .on("data", () => {
          lineCount++;
          if (lineCount > MulterConfig.MAX_CSV_LINES) {
            stream.destroy();

            if (fs.existsSync(filePath)) {
              fs.unlink(filePath, (err) => {
                if (err)
                  logger.error({ msg: "Error deleting file", error: err });
              });
            }

            if (!responseSent) {
              responseSent = true;
              return res.status(400).json({
                code: multerErrorCodes.CSV_TOO_LARGE,
                statusCode: 400,
                statusCodeAsString: "BAD_REQUEST",
                description: "CSV file exceeds 1000 lines",
              });
            }
          }
        })
        .on("error", (error) => {
          stream.destroy();

          if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
              if (err) logger.error({ msg: "Error deleting file", error: err });
            });
          }

          if (!responseSent) {
            responseSent = true;
            if (error.code === "CSV_RECORD_INCONSISTENT_COLUMNS") {
              return res.status(400).json({
                code: multerErrorCodes.CSV_INVALID_FORMAT,
                statusCode: 400,
                statusCodeAsString: "BAD_REQUEST",
                description: `CSV format error: ${error.message}, Please check 'memberId'; it is currently a string: '[1,2,3]'.`,
              });
            }
            return cb(new InternalServerError("Error reading CSV file"));
          }
        })
        .on("end", () => {
          if (!responseSent) cb(null, true);
        });
    } catch (error) {
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) logger.error({ msg: "Error deleting file", error: err });
        });
      }

      logger.error({ msg: `Error processing CSV file`, error });
      if (!responseSent) {
        responseSent = true;
        return cb(new InternalServerError("Error processing CSV file"));
      }
    }
  }

  public getUploader() {
    return multer({
      storage: this.storage(),
      fileFilter: (req, file, cb) => {
        this.fileFilter(req, file, cb, req.res as Response);
      },
      limits: { fileSize: 100 * 1024 * 1024 },
    });
  }

  public async validateUploadedFile(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    if (!req.file) {
      return res.status(400).json({
        code: multerErrorCodes.NO_FILE_UPLOADED,
        statusCode: 400,
        statusCodeAsString: "BAD_REQUEST",
        description: "No file uploaded",
      });
    }

    const filePath = req.file.path;
    await this.validateCsv(filePath, res, (error) => {
      if (error) return res.status(400).json(error);
      next();
    });
  }
}

export const upload = new MulterConfig().getUploader();
export const validateUploadedFile =
  new MulterConfig().validateUploadedFile.bind(new MulterConfig());
