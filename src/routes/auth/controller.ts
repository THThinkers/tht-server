import { Request, RequestHandler, Response } from 'express';
import request from 'request';
import User, { IUser } from '../../schema/User';
import { IError } from '../../types/error';
import { IUserSignup } from '../../types/user';

const { UI_SERVER, KAUTH_APP_KEY, KAUTH_REDIRECT_URL } = process.env;
/* 구글 로그인시 callback */
interface ICallbackRequest extends Request {
  user?: IUser;
}
const callback = (req: ICallbackRequest, res: Response) => {
  let redirectUrl = UI_SERVER!;
  if (req.user) {
    if (!req.user._id) {
      if (req.user.googleId) {
        redirectUrl = `${redirectUrl}/auth/check?googleId=${req.user.googleId}`;
      }
      if (req.user.username) {
        redirectUrl = `${redirectUrl}&username=${req.user.username}`;
      }
    }
  }
  return res.redirect(redirectUrl);
};
// 카카오 로그인시 콜백
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
      request.get(options, async (reqErr, __, reqBody) => {
        const profile = JSON.parse(reqBody);
        const kakaoId = profile.id;
        const query = { kakaoId };
        const projection = { _id: 1 };
        try {
          const user = await User.findOne(query, projection);
          // 카카오 유저 연동 안되어있을시. 중복체크 없이 바로 유저에게 정보 요청
          if (!user) {
            return res.redirect(
              `${UI_SERVER}/auth/check?kakaoId=${profile.id}`,
            );
          }
          // 카카오 유저 연동 되있을 시( isLinked 없어도 연동되어있다고 가정 )
          if (req.session) {
            req.session.passport = {
              user,
            };
          }
          return res.redirect(UI_SERVER!);
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
    req.session.destroy(err => {
      if (err) {
        next(err);
      }
      return res.redirect(UI_SERVER!);
    });
  }
};
// 로컬 signup과 oauth signup 구분 필요
const signup: RequestHandler = (req, res, next) => {
  const { username, password, name } = req.body;
  try {
    const user = new User({ username, password, name });
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
// oauth계정 회원가입시 _id 필요
const oauthSignup: RequestHandler = (req, res, next) => {
  const { _id, username, password, name } = req.body;
  User.findById(_id, (err, user) => {
    if (err) {
      err.isOperational = true;
      next(err);
    }
    if (!user) {
      const error: IError = new Error('Oauth 인증에 실패하였습니다.');
      error.isOperational = true;
      next(error);
    }
    user = Object.assign(user, {
      fillRequired: true,
      username,
      password,
      name,
    });
    user.save((error, updatedUser) => {
      if (error) {
        error.isOperational = true;
        next(error);
      }
      res.json({
        success: true,
      });
    });
  });
};
// 기존계정 또는 새로 만든 계정과 oauth 계정을 link
const oauthLink: RequestHandler = async (req, res, next) => {
  const { username, ...restInfo } = req.body; // kakaoId 또는 googleId 필수
  try {
    let existUser = await User.findOne({ username });
    // 기존계정에 연동하는 방법
    if (existUser) {
      existUser = Object.assign({}, existUser, restInfo as Partial<IUser>, {
        isLinked: true,
      });
      await existUser.save();
      return res.json({
        success: true,
      });
    }
    const newUser = new User({ username, ...restInfo, isLinked: true });
    await newUser.save();
    return res.json({
      success: true,
    });
  } catch (err) {
    err.isOperational = true;
    next(err);
  }
};
export {
  callback,
  callbackKakao,
  oauthKakao,
  oauthSignup,
  oauthLink,
  getProfile,
  login,
  logout,
  signup,
};
