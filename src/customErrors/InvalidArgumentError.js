import { CustomError } from './CustomError.js';

export class InvalidArgumentError extends CustomError {
  constructor(message, statusCode = 400) {
    super(message, 'InvalidArgumentError', statusCode);
  }
}
