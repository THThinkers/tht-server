import { Response, Request } from 'express';
import request from 'request';
import User, { IUser } from '../../schema/User';

const { UI_SERVER, KAUTH_APP_KEY, KAUTH_REDIRECT_URL } = process.env;
/* oauth callback, putProfile */
const callback = (req: Request, res: Response) => {
  // 기본 정보를 입력 했는지. 필드를 따로 만드는 게 좋을 듯?
  return res.redirect(UI_SERVER!);
};
const callbackKakao = (req: Request, res: Response) => {
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
      request.get(options, (err, _, body) => {
        const profile = JSON.parse(body);
        const query = { kakaoId: profile.id };
        const projection = { _id: 1 };
        const callback = (err, user) => {
          if (req.session) {
            req.session.passport = {
              user,
            };
            return res.redirect(UI_SERVER!);
          }
        };
        User.findOneOrCreate(query, projection, callback);
      });
    },
  );
};
const oauthKakao = (_, res: Response) => {
  return res.redirect(
    `https://kauth.kakao.com/oauth/authorize?client_id=${KAUTH_APP_KEY}&redirect_uri=${KAUTH_REDIRECT_URL}&response_type=code`,
  );
};

const putProfile = (req: Request, res: Response) => {
  const user: IUser = req.body;
  const { _id, ...rest } = user;
  const updateField = {
    ...rest,
    isVerified: true,
  };
  const callback = (err, user) => {
    if (err) {
      return res.status(503).json({
        message: 'Database error',
      });
    }
    return res.json({
      user,
    });
  };
  User.findByIdAndUpdate(_id, updateField, { new: true }, callback);
};
const getProfile = (req: Request, res: Response) => {
  return res.json({
    user: req.user,
  });
};

const logout = (req: Request, res: Response) => {
  if (req.session) {
    req.session.destroy(err => {
      return res.redirect(UI_SERVER!);
    });
  }
};
export { callback, callbackKakao, oauthKakao, getProfile, putProfile, logout };
