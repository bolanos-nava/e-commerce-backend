/* eslint-disable camelcase */
import { z } from 'zod';
import { capitalize } from '../../utils/index.js';

/**
 * @typedef {import('../../types/index.js').ProductType} ProductType
 */

/** @type {z.ZodErrorMap} */
function errorMap(issue, ctx) {
  const { code, path } = issue;
  const { invalid_type, too_small, too_big } = z.ZodIssueCode;
  const propWithError = capitalize(path[0]);

  if (code === invalid_type) {
    if (issue.received === 'undefined') {
      return {
        message: `${propWithError} is required and must be of type ${issue.expected}`,
      };
    }

    return {
      message: `${propWithError} must be a ${issue.expected}`,
    };
  }

  if (code === too_small || code === too_big) {
    const messages = {
      too_small: {
        number: `${propWithError} must be a number greater than ${issue.minimum}`,
        string: `${propWithError} should not be empty`,
        default: `${propWithError} is too small`,
      },
      too_big: {
        number: `${propWithError} must be a number less than ${issue.maximum}`,
        string: `${propWithError} should be at most ${issue.maximum} characters long`,
        default: `${propWithError} is too large`,
      },
    };
    switch (issue.type) {
      case 'number':
      case 'string':
        return {
          message: messages[code][issue.type],
        };
      default:
        return {
          message: messages[code].default,
        };
    }
  }

  return { message: ctx.defaultError };
}

z.setErrorMap(errorMap);

export const ProductRequestSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().min(1).max(500),
    category: z.string().min(1),
    price: z.number().gt(0),
    stock: z.number().gt(0),
    code: z.string().min(1),
    status: z.boolean(),
  })
  .partial({
    thumbnails: z.array(z.string().url()),
  });

/** Validates if a product with the same code doesn't exist
 * @param {ProductType} product
 * @param {ProductType[]} products
 * @returns
 */
export function validateDuplicatedCode(product, products) {
  const codeAlreadyExists = products
    .filter((p) => p.id !== product.id)
    .some((p) => p.code === product.code);
  const ProductCodeValidator = z.object({
    code: z.string().refine(() => !codeAlreadyExists, {
      message: `Product with code ${product.code} already exists`,
    }),
  });
  return ProductCodeValidator.passthrough().parse(product);
}
