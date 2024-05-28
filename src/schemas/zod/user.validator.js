import { z } from 'zod';

export const userValidator = z.object({
  firstName: z.string().min(3),
  lastName: z.string().default(''),
  email: z.string().email(),
  password: z.string().min(8).max(16),
});
