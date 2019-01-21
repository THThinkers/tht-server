import { Request, RequestHandler, Response } from 'express';
import request from 'request';
import User, { IUser } from '../../schema/User';
import { IUserSignup } from '../../types/user';

const { UI_SERVER, KAUTH_APP_KEY, KAUTH_REDIRECT_URL } = process.env;
/* oauth callback, putProfile */
const callback = (req: Request, res: Response) => {
  // 기본 정보를 입력 했는지. 필드를 따로 만드는 게 좋을 듯?
  return res.redirect(UI_SERVER!);
};
const callbackKakao = (req: Request, res: Response, next) => {
  const { code } = req.query;
  const data = {
    grant_type: 'authorization_code',
    client_id: KAUTH_APP_KEY,
    redirect_uri: KAUTH_REDIRECT_URL,
    code,
  };
  // callback으로 받은 코드를 가지고 토큰 요청.
  request.post(
    { url: 'https://kauth.kakao.com/oauth/token', form: data },
    (err, _, body) => {
      const { access_token } = JSON.parse(body);
      const options = {
        url: 'https://kapi.kakao.com/v2/user/me',
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      };
      // 받은 토큰을 이용해 프로필 요청
      request.get(options, (reqErr, __, reqBody) => {
        const profile = JSON.parse(reqBody);
        const query = { kakaoId: profile.id };
        const projection = { _id: 1 };
        const handleResponse = (error, user) => {
          if (error) {
            error.isOperational = true;
            next(error);
          }
          if (req.session) {
            req.session.passport = {
              user,
            };
            return res.redirect(UI_SERVER!);
          }
        };
        try {
          User.findOneOrCreate(query, projection, handleResponse);
        } catch (err) {
          err.isOperational = true;
          next(err);
        }
      });
    },
  );
};
const oauthKakao = (_, res: Response) => {
  return res.redirect(
    // tslint:disable-next-line:max-line-length
    `https://kauth.kakao.com/oauth/authorize?client_id=${KAUTH_APP_KEY}&redirect_uri=${KAUTH_REDIRECT_URL}&response_type=code`,
  );
};

const putProfile = (req: Request, res: Response, next) => {
  const user: IUser = req.body;
  const { _id, ...rest } = user;
  const updateField: Partial<IUser> = {
    ...rest,
    fillRequired: true,
  };
  const handleResponse = (err, userData) => {
    if (err) {
      err.isOperational = true;
      next(err);
    }
    return res.json({
      user: userData,
    });
  };
  User.findByIdAndUpdate(_id, updateField, { new: true }, handleResponse);
};
const getProfile = (req: Request, res: Response) => {
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
const signup: RequestHandler = (req, res, next) => {
  const { username, password, name } = req.body;
  try {
    const user = new User({ username, password, name });
    user.save((err, savedUser) => {
      if (err) {
        err.isOperational = true;
        throw err;
      }
      console.log(savedUser);
      res.json({
        success: true,
      });
    });
  } catch (err) {
    next(err);
  }
};
export {
  callback,
  callbackKakao,
  oauthKakao,
  getProfile,
  putProfile,
  login,
  logout,
  signup,
};
