import { RequestHandler } from 'express';
import User from '../../../schema/User';
import { IError } from '../../../types/error';

const checkAdmin: RequestHandler = async (req, res, next) => {
  const errorHandler = (message: string) => {
    const error: IError = new Error(message);
    error.isOperational = true;
    next(error);
  };
  if (req.session) {
    try {
      const { admin } = req.session;
      if (!admin || !admin.id) {
        return errorHandler('Cannot find logged in admin.');
      }
      const matchAdmin = User.findById(admin.id);
      (req as any).admin = matchAdmin;
      next();
    } catch (err) {
      return errorHandler(err.message);
    }
  } else {
    return errorHandler('session error');
  }
};

export default checkAdmin;
