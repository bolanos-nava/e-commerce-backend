export class UnauthorizedError extends Error {
  constructor(message) {
    super(message || 'Unauthorized');
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
  }
}
