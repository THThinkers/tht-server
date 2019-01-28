import { ErrorRequestHandler } from 'express';
import errorHandler from '../../handlers/error';
import { IError } from '../../types/error';

const adminErrorHandler: ErrorRequestHandler = async (err, req, res, next) => {
  await errorHandler(err);
  res.status(err.statusCode || 403).json({
    error: err.message,
  });
};

export default adminErrorHandler;
