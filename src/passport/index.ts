import passport from 'passport';
import googleStrategy from './strategy/google';
/* passport에서 세션을 사용할 때 설정해주어야하는 설정 */
interface IUser {
  id: string;
  // session으로 넣어줄 유저 정보...
}
passport.serializeUser((user: IUser, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const fakeUser = {
    id,
    email: 'fakeemail@something.com',
  };
  done(null, fakeUser);
});

passport.use(googleStrategy);

export default passport;
