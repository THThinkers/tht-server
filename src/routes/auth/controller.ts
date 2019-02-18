import { Request, RequestHandler, Response } from 'express';
import User, { IUser } from '../../schema/User';

const { UI_SERVER } = process.env;

const getProfile = async (req: Request, res: Response) => {
  if (!req.user || !req.user.id) {
    delete req.user;
  }
  return res.json({
    user: req.user,
  });
};
// 패스포트 local strategy 완료 후 콜백
const login: RequestHandler = (req, res, next) => {
  if (req.user) {
    return res.json({
      success: true,
    });
  } else {
    // 아마 여기에 올일 없을거라 예상
    return res.status(403).json({
      success: false,
    });
  }
};
const logout = (req: Request, res: Response, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        next(err);
      }
      return res.redirect(UI_SERVER!);
    });
  }
};
// 로컬 signup과 oauth signup 구분 필요
const signup: RequestHandler = (req, res, next) => {
  try {
    const user = new User({
      ...req.body,
      fillRequired: true,
    });
    user.save((err, savedUser) => {
      if (err) {
        err.isOperational = true;
        throw err;
      }
      res.json({
        success: true,
      });
    });
  } catch (err) {
    next(err);
  }
};
export { getProfile, login, logout, signup };
