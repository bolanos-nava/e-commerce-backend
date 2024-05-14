import { z } from 'zod';

export const cartValidator = z.object({ quantity: z.number().min(1) });
