import { ErrorRequestHandler } from 'express';
import { IError } from '../../types/error';
import errorHandler from '../../handlers/error';

const adminErrorHandler: ErrorRequestHandler = async (err, req, res, next) => {
  await errorHandler(err);
  res.status(err.statusCode || 403).json({
    error: err.message,
  });
};

export default adminErrorHandler;
