export class ResourceNotFoundError extends Error {
  constructor(message, { statusCode, resourceId } = {}) {
    if (!message) {
      // eslint-disable-next-line no-param-reassign
      message = `Resource${resourceId ? `with ${resourceId}` : ''} not found`;
    }
    super(message);
    this.name = 'ResourceNotFoundError';
    this.statusCode = statusCode || 404;
  }
}
