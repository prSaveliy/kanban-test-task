import { ZodType } from 'zod';
import type { Request } from 'express';
import type { AppError } from '../common/interfaces/error/AppError.js';

type RequestSource = 'body' | 'params' | 'query';

export const validateRequest = <T>(
  request: Request,
  schema: ZodType<T>,
  errorMessage: string,
  source: RequestSource = 'body',
): T => {
  const parseResult = schema.safeParse(request[source]);

  if (!parseResult.success) {
    const error = new Error(errorMessage) as AppError;
    error.statusCode = 400;
    error.details = parseResult.error as unknown as Record<string, unknown>;

    throw error;
  }

  return parseResult.data;
};

export default validateRequest;
