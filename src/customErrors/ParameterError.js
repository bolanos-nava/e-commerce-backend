import { CustomError } from './CustomError.js';

export class ParameterError extends CustomError {
  constructor(message, statusCode = 400) {
    super(message, 'ParameterError', statusCode);
  }
}
