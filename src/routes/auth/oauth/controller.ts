import { Request, RequestHandler } from 'express';
import request from 'request';
import User, { IUser } from '../../../schema/User';
import { IError } from '../../../types/error';
const { UI_SERVER, KAUTH_APP_KEY, KAUTH_REDIRECT_URL } = process.env;

/* 구글 로그인시 callback */
interface ICallbackRequest extends Request {
  user?: IUser;
}
const callbackGoogle: RequestHandler = (req: ICallbackRequest, res) => {
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
const callbackKakao: RequestHandler = (req, res, next) => {
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
      if (err) {
        err.isOperational = true;
        return next(err);
      }
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
          if (!kakaoId) {
            throw new Error('카카오 인증에 실패하였습니다.');
          }
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
const oauthKakao: RequestHandler = (_, res) => {
  return res.redirect(
    // tslint:disable-next-line:max-line-length
    `https://kauth.kakao.com/oauth/authorize?client_id=${KAUTH_APP_KEY}&redirect_uri=${KAUTH_REDIRECT_URL}&response_type=code`,
  );
};

// oauth계정 회원가입시 _id 필요
// 요구 사항이 바뀌어서 수정 필요.
/*
  oauth 회원가입시 두 가지 경우 가능. 이미 있는 아이디에 링크하거나 새로 로컬 아이디 파서 연동
  link - 전자 signup - 후자 ?
*/
const oauthSignup: RequestHandler = async (req, res, next) => {
  const {
    _id,
    username,
    password,
    name,
    studentId,
    major,
    tags,
    googleId,
    kakaoId,
  } = req.body;
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
      studentId,
      major,
      tags,
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
    // 새로 계정을 만들었을 경우
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

export { callbackGoogle, callbackKakao, oauthKakao, oauthSignup, oauthLink };
