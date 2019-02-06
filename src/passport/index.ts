import passport from 'passport';
import User, { IUser } from '../schema/User';
import { IError } from '../types/error';
import googleStrategy from './strategy/google';
import localStrategy from './strategy/local';

// strategy 설정 - google, kakao, facebook?
passport.use(localStrategy);
passport.use(googleStrategy);
// passport session 사용시 필요한 설정 - session에 넣어줄 값을 설정해줌.
// 아래와 같은 경우 req.session.passport.user = { id: user.id }
// 이런식으로 저장됨.
passport.serializeUser((user: IUser, done) => {
  if (user._id) {
    done(null, { _id: user._id });
  } else {
    done(null, user);
  }
});

// 위 serializeUser에서 설정된 id를 받아서 DB에서 id를 찾고 user를 done에 넣어줌.
// session에 user object를 다 넣어주는건 좋지 못한 방법이기 때문에(field를 하나 바꾸면 session과 불일치 할 수 있음)
// 이런식으로 해주는 것. 이렇게 반환된 user는 모든 route에서 req.user로 접근할 수 있다.
// done은 passport에서 상황에 따라 관리한다. next처럼 생각해도 됨. 더 자세하게 알려면 밑에 코드를 보자.
// tslint:disable-next-line:max-line-length
// https://github.com/jaredhanson/passport/blob/0b3931330e245d8e8851328a7dc436433d6411c9/lib/middleware/authenticate.js#L171

passport.deserializeUser(async (serializedUser: IUser, done) => {
  try {
    if (!serializedUser) {
      throw new Error('세션 deserialize 실패');
    }
    if (!serializedUser._id) {
      return done(null, serializedUser);
    }
    const user = await User.findById(serializedUser._id);
    if (!user) {
      const error: IError = new Error('세션 만료');
      error.isOperational = true;
      throw error;
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

export default passport;
