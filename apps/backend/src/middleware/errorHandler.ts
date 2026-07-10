import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  console.error(`[Error] ${statusCode}: ${message}`, error);

  res.status(statusCode).json({
    error: {
      statusCode,
      message,
      code: error.code || 'INTERNAL_ERROR',
      timestamp: new Date().toISOString(),
    },
  });
};
