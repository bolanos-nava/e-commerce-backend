export class ResourceNotFoundError extends Error {
  constructor(message, { status, resourceId } = {}) {
    if (!message) {
      // eslint-disable-next-line no-param-reassign
      message = `Resource${resourceId ? `with ${resourceId}` : ''} not found`;
    }
    super(message);
    this.name = 'ResourceNotFound';
    this.statusCode = status || 404;
  }
}
