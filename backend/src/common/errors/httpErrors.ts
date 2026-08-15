import type { AppError } from '../interfaces/error/AppError.js';

export class BadRequestError extends Error implements AppError {
  statusCode = 400;
  details?: Record<string, unknown>;

  constructor(message = 'Bad Request', details?: Record<string, unknown>) {
    super(message);
    this.name = 'BadRequestError';
    this.details = details;
  }
}

export class NotFoundError extends Error implements AppError {
  statusCode = 404;

  constructor(message = 'Not Found') {
    super(message);
    this.name = 'NotFoundError';
  }
}
