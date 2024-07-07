import { CustomError } from './CustomError.js';

export class ForbiddenError extends CustomError {
  constructor(message) {
    super(message || 'Forbidden', 'ForbiddenError', 403);
  }
}
