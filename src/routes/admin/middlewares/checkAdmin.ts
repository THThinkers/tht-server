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
        (req as any).admin = {};
        return res.json({
          admin: null,
        });
      }
      const matchAdmin = await User.findById(admin.id, '_id name');
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
