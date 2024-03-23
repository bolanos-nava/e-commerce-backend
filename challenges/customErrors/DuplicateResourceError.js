export class DuplicateResourceError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DuplicateResourceError';
  }
}
