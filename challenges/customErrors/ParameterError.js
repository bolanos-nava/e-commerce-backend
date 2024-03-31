export class ParameterError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'ParameterError';
    this.statusCode = statusCode || 400;
  }
}
