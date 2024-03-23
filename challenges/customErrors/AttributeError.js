export class AttributeError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AttributeError';
  }
}
