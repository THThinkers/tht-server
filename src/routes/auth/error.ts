import { Request, Response } from 'express';
import errorHandler from '../../handlers/error';
import { IError } from '../../types/error';

export const authErrorHandler = async (
  err: IError,
  req: Request,
  res: Response,
) => {
  await errorHandler(err);
  res.json({
    error: err.message,
  });
};
