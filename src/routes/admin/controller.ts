import { RequestHandler } from 'express';
import User, { IUser } from '../../schema/User';

// admin 계정 로그인. 세션에 저장해도 되나?
const login: RequestHandler = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const matchUser = await User.findOne({ username });
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

const logout: RequestHandler = async (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        next(err);
      }
      return res.json({
        success: true,
      });
    });
  } else {
    return res.json({
      success: true,
    });
  }
};

const getProfile: RequestHandler = async (req, res, next) => {
  const admin = (req as any).admin;
  if (admin) {
    return res.json({
      admin,
    });
  } else {
    return res.json({
      admin: null,
    });
  }
};

export { login, logout, getProfile };
