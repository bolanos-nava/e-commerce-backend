import { CustomError } from './CustomError.js';

export class DuplicateResourceError extends CustomError {
  constructor(message) {
    super(message, 'DuplicateResourceError', 409);
  }
}
