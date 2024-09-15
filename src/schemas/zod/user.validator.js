import { z } from 'zod';

export const userValidator = z.object({
  firstName: z.string().min(1),
  lastName: z.string().default(''),
  email: z.string().email(),
  password: z.string().min(1),
  role: z
    .enum(['admin', 'user', 'user_premium'])
    .default('user')
    .optional()
    .catch('user'),
  // TODO: re-add length validation and show validation error in frontend
  // password: z.string().min(8).max(16),
});
