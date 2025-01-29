import { Schema, ValidationError } from "joi";

export interface IValidatorService {
  validate<T>(
    schema: Schema<T>,
    data: T,
  ): { error?: ValidationError; value: T };
  formatErrorMessage(error: ValidationError): IValidationError[];
}

export interface IValidationError {
  fieldName: string;
  message: string;
}
