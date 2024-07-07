export class CustomError extends Error {
  constructor(message, name, statusCode = 500) {
    super(message || 'Unexpected error');
    this.name = name || 'Error';
    this.statusCode = statusCode;
  }
}
