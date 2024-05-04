/* eslint-disable camelcase */
import { z } from 'zod';
import { capitalize } from '../../utils/index.js';

/**
 * @typedef {import('../../types/index.js').ProductType} ProductType
 */

/** @type {z.ZodErrorMap} */
function errorMap(issue, ctx) {
  const { code, path } = issue;
  const { invalid_type, too_small, too_big, invalid_string } = z.ZodIssueCode;
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

  if (code === invalid_string) {
    switch (issue.validation) {
      case 'url':
        return {
          message: `${propWithError} must be valid URLs`,
        };
      default:
        return {
          message: `${propWithError} has an invalid ${issue.validation} structure`,
        };
    }
  }

  return { message: ctx.defaultError };
}

z.setErrorMap(errorMap);

export const productValidator = z.object({
  title: z.string().min(1),
  description: z.string().min(1).max(500),
  categoryId: z.string().min(1),
  price: z.number().gt(0),
  stock: z.number().gt(0),
  code: z.string().min(1),
  status: z.boolean().default(true),
  thumbnails: z.array(z.string().url()).default([]),
});

export function getProductValidator(product, codeExists) {
  return z.object({
    title: z.string().min(1),
    description: z.string().min(1).max(500),
    categoryId: z.string().min(1),
    price: z.number().gt(0),
    stock: z.number().gt(0),
    code: z
      .string()
      .min(1)
      .refine(() => !codeExists, {
        message: `Product with code ${product.code} already exists`,
      }),
    status: z.boolean().default(true),
    thumbnails: z.array(z.string().url()).default([]),
  });
}

/** Returns a validator for duplicated product code
 * @param {ProductType} product
 * @param {Boolean} codeAlreadyExists
 * @returns Zod validator for duplicated code
 */
export function getCodeValidator(product, codeAlreadyExists) {
  const codeValidator = z.object({
    code: z.string().refine(() => !codeAlreadyExists, {
      message: `Product with code ${product.code} already exists`,
    }),
  });
  return codeValidator;
}

/** Returns a validator for duplicated product code
 * @param {ProductType} product
 * @param {ProductType[]} products
 * @returns Zod validator for duplicated code
 */
// export function getCodeValidator(product, products) {
//   const codeAlreadyExists = products
//     .filter((p) => p.id !== product.id)
//     .some((p) => p.code === product.code);
//   const codeValidator = z.object({
//     code: z.string().refine(() => !codeAlreadyExists, {
//       message: `Product with code ${product.code} already exists`,
//     }),
//   });
//   return codeValidator;
// }
