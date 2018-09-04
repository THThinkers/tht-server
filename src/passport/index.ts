import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth';

const { OAuth2Strategy } = GoogleStrategy;
const clientID =
  '99739361111-h9oop30vf33dgosqnkpu4h45qo5lmbk6.apps.googleusercontent.com';
const clientSecret = 'xy6p0TUPBNg3yv7M_IOBSE1E';
passport.use(
  new OAuth2Strategy(
    {
      clientID,
      clientSecret,
      callbackURL: 'http://localhost:4000/api/auth/redirected',
    },
    function auth(accessToken, refreshToken, profile, done) {
      const fakeUser = {
        googleId: profile.id,
      };
      return done('', fakeUser);
    },
  ),
);

export default passport;
