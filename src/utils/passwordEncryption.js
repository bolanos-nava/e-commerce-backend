import { hashSync, genSaltSync, compareSync } from 'bcrypt';

export function encryptPassword(password) {
  return hashSync(password, genSaltSync(10));
}

/**
 * Compares a plain-text password with a hashed password
 *
 * @param {String} plainTextPw
 * @param {String} hashedPw
 * @returns True if passwords match, false otherwise
 */
export function isValidPassword(plainTextPw, hashedPw) {
  return compareSync(plainTextPw, hashedPw);
}
