import { z } from 'zod';
import 'dotenv/config';
import { logger } from '../utils/logger.js';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  PORT: z.coerce.number().int().positive(),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  CORS_ORIGIN: z.string().min(1, 'CORS_ORIGIN is required'),
});

export type Env = z.infer<typeof envSchema>;

export const validateEnv = (): Env => {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    logger.fatal({
      error: 'Missing or invalid environment variables:',
      fields: parsed.error.flatten().fieldErrors,
    });
    process.exit(1);
  }

  return parsed.data;
};
