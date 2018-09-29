import GoogleStrategy from 'passport-google-oauth';
import User from '../../schema/User';
const { OAuth2Strategy } = GoogleStrategy;
const {
  GAUTH_CLIENT_ID,
  GAUTH_CLIENT_SECRET,
  GAUTH_REDIRECT_URL,
} = process.env;
interface IProfile {
  id?: String;
  email?: String;
}
const googleStrategy = new OAuth2Strategy(
  {
    clientID: GAUTH_CLIENT_ID,
    clientSecret: GAUTH_CLIENT_SECRET,
    callbackURL: GAUTH_REDIRECT_URL,
  },
  // token 처리는 나중에 생각해봅시다.
  function auth(accessToken, refreshToken, profile: IProfile, done) {
    const query = { googleId: profile.id };
    const callback = (err, user) => {
      if (err) return done(null);
      return done(null, user);
    };
    User.findOneOrCreate(query, { _id: 1 }, callback);
  },
);

export default googleStrategy;
