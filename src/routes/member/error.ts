import { Request, Response } from 'express';
import errorHandler from '../../handlers/error';
import { IError } from '../../types/error';

export const memberErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next,
) => {
  await errorHandler(err);
  res.status(err.statusCode || 403).json({
    error: err.message,
  });
};
