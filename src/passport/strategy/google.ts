import GoogleStrategy from 'passport-google-oauth';
import User from '../../schema/User';
const { OAuth2Strategy } = GoogleStrategy;
const {
  GAUTH_CLIENT_ID,
  GAUTH_CLIENT_SECRET,
  GAUTH_REDIRECT_URL,
} = process.env;
interface IProfile {
  id: string;
  emails: [
    {
      value: string;
      type: string;
    }
  ];
}
const googleStrategy = new OAuth2Strategy(
  {
    clientID: GAUTH_CLIENT_ID,
    clientSecret: GAUTH_CLIENT_SECRET,
    callbackURL: GAUTH_REDIRECT_URL,
  },
  // token 처리는 나중에 생각해봅시다.
  async function auth(accessToken, refreshToken, profile: IProfile, done) {
    const gId = profile.id;
    const gmail = profile.emails[0].value;
    try {
      const user = await User.findOne({ googleId: gId });
      if (!user) {
        const existUser = await User.findOne({ username: gmail });
        if (existUser) {
          // isLinked false. 이메일 o. 이메일로 로그인 요청.
          return done(null, { username: gmail, googleId: gId });
        }
        // isLinekd false, 이메일 x 사용자에게 정보 요청
        return done(null, { googleId: gId });
      }
      // isLinked ture. 바로 로그인 처리.
      if (user.isLinked) {
        return done(null, user);
      }
      return done(new Error('Gauth 로그인 에러'));
    } catch (err) {
      err.isOpertaional = true;
      done(err);
    }
  },
);

export default googleStrategy;
