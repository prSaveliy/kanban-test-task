import type { NextFunction, Request, Response } from 'express';
import type { AppError } from '../common/interfaces/error/AppError.js';
import { logger } from './logger.js';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (res.headersSent) {
    return next(err);
  }

  const isErrorObj = typeof err === 'object' && err !== null;
  const appErr = (isErrorObj ? err : {}) as AppError;
  const statusCode = appErr.statusCode;

  if (typeof statusCode === 'number') {
    if (statusCode >= 500) {
      logger.error(
        {
          err,
          status: statusCode,
          method: req.method,
          path: req.path,
        },
        appErr.message || 'Internal server error',
      );

      res.status(statusCode).json({
        error: appErr.message || 'Internal server error',
        ...(appErr.details ? { details: appErr.details } : {}),
        cause: process.env.NODE_ENV === 'production' ? undefined : appErr.cause,
      });
      return;
    }

    res.status(statusCode).json({
      error: appErr.message,
      ...(appErr.details ? { details: appErr.details } : {}),
      cause: process.env.NODE_ENV === 'production' ? undefined : appErr.cause,
    });
    return;
  }

  logger.error(
    {
      err,
      method: req.method,
      path: req.path,
    },
    'Unhandled error',
  );

  res.status(500).json({ error: 'Internal server error' });
};
