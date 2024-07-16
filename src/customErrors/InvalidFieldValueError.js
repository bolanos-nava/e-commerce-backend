import { CustomError } from './CustomError.js';

export class InvalidFieldValueError extends CustomError {
  constructor(message, statusCode = 400) {
    super(message, 'InvalidFieldValue', statusCode);
  }
}
