export class ResourceNotFoundError extends Error {
  constructor(message, resourceId) {
    if (!message) {
      message = `Resource${resourceId ? `with ${resourceId}` : ''} not found`;
    }
    super(message);
    this.name = 'ResourceNotFound';
    this.statusCode = 404;
  }
}
