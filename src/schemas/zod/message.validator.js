import { z } from 'zod';

export const messageValidator = z.object({
  user: z.string().email(),
  message: z.string().min(1).max(500),
});
