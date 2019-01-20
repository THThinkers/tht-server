import { RequestHandler } from 'express';
import User, { IUser } from '../../../schema/User';

const getUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await User.find({}, 'name isAdmin isVerified');
    return res.json({
      users,
    });
  } catch (err) {
    err.isOperational = true;
    next(err);
  }
};

const verifyUser: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.body;
    await User.findOneAndUpdate(userId, { isAdmin: true });
    res.json({
      success: true,
    });
  } catch (err) {
    err.isOperational = true;
    next(err);
  }
};
export { getUsers, verifyUser };
