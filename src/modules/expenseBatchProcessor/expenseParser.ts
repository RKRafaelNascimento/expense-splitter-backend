import fs from "fs";
import { parse } from "csv-parse";
import { IExpenseBatchProcessorData } from "./interfaces";

export class ExpenseParser {
  static async processCsv(
    filePath: string,
    processLine: (data: IExpenseBatchProcessorData) => Promise<void>,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(filePath);

      const parser = parse({
        delimiter: ",",
        columns: true,
        trim: true,
      });

      stream.pipe(parser);

      parser.on("data", async (row) => {
        const isValidNumber = (value: string) => /^-?\d+(\.\d+)?$/.test(value);

        await processLine({
          name: row.name,
          amount: isValidNumber(row.amount)
            ? parseFloat(row.amount)
            : row.amount,
          groupId: isValidNumber(row.groupId)
            ? Number(row.groupId)
            : row.groupId,
          memberId: isValidNumber(row.memberId)
            ? Number(row.memberId)
            : row.memberId,
          memberIds: row.memberIds ? JSON.parse(row.memberIds) : [],
        });
      });

      parser.on("end", resolve);
      parser.on("error", reject);
    });
  }
}
