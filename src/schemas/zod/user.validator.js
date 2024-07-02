import { z } from 'zod';

export const userValidator = z.object({
  firstName: z.string().min(1),
  lastName: z.string().default(''),
  email: z.string().email(),
  // TODO: re-add length validation
  password: z.string().min(1),
  // password: z.string().min(8).max(16),
});
