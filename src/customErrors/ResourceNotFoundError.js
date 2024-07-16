import { CustomError } from './CustomError.js';

export class ResourceNotFoundError extends CustomError {
  constructor(message, { statusCode = 404, resourceId } = {}) {
    if (!message) {
      // eslint-disable-next-line no-param-reassign
      message = `Resource${resourceId ? `with ${resourceId}` : ''} not found`;
    }
    super(message, 'ResourceNotFoundError', statusCode);
  }
}
