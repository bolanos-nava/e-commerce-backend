import { z } from 'zod';

export const sessionValidator = z.object({
  email: z.string().email(),
  password: z.string(),
});
