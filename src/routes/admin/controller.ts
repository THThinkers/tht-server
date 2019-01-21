import { RequestHandler } from 'express';
import User, { IUser } from '../../schema/User';

// admin 계정 로그인. 세션에 저장해도 되나?
const login: RequestHandler = async (req, res, next) => {
  const { name, password } = req.body;
  try {
    const matchUser = await User.findOne({ name });
    const error = new Error();
    if (matchUser) {
      const matched = matchUser.comparePassword(password);
      if (!matched) {
        error.message = 'Wrong password';
        throw error;
      }
      if (!matchUser.isAdmin) {
        error.message = 'Not admin user';
        throw error;
      }
      req.session!.admin = {
        id: matchUser.id,
      };
      return res.json({
        success: true,
      });
    } else {
      error.message = 'Cannot find user';
      throw error;
    }
  } catch (err) {
    next(err);
  }
};
export { login };
