import jwt from 'jsonwebtoken';

/**
 * @typedef {import('../types').ObjectType} ObjectType
 * @typedef {import('jsonwebtoken').SignOptions} JWTSignOptions
 * @typedef {import('jsonwebtoken').VerifyOptions} JWTVerifyOptions
 */

export class JwtTokenFactory {
  /**
   * JWT signing key
   *
   * @type {string}
   */
  #signingSecret;

  /**
   * Expiration time
   *
   * @type {string}
   */
  #expiresIn;

  /**
   * Constructs a new JwtTokenFactory injecting the secret key
   *
   * @param {string} signingSecret - Secret key to sign the JWT
   * @param {string} expiresIn - Expiration time of the JWT
   */
  constructor(signingSecret, expiresIn) {
    this.#signingSecret = signingSecret;
    this.#expiresIn = expiresIn;
  }

  /**
   * Generates new JWT with a set of claims
   *
   * @param {ObjectType} claims - Claims to encode
   * @param {JWTSignOptions} options - Options to generate the JWT
   * @returns String representation of the JWT
   */
  generateToken(claims, options) {
    return jwt.sign(claims, this.#signingSecret, {
      expiresIn: this.#expiresIn,
      ...options,
    });
  }

  /**
   * Verifies token agains the signing key
   *
   * @param {string} token - String representation of the JWT
   * @param {JWTVerifyOptions} options - Options for the verification
   * @returns Decoded claims contained in the JWT
   */
  verifyToken(token, options) {
    return jwt.verify(token, this.#signingSecret, options);
  }
}
