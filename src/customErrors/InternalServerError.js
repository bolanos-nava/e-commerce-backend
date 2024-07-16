import { CustomError } from './CustomError.js';

export class InternalServerError extends CustomError {
  constructor(message) {
    super(message || 'Unexpected error', 'InternalServerError', 500);
  }
}
