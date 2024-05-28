export class DuplicateResourceError extends Error {
  constructor(message, statusCode = 409) {
    super(message);
    this.name = 'DuplicateResourceError';
    this.statusCode = statusCode;
  }
}
