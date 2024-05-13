import { z } from 'zod';

export const quantityValidator = z.number().min(0);
