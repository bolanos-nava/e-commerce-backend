export class InvalidFieldValueError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'InvalidFieldValue';
    this.statusCode = statusCode || 400;
  }
}
