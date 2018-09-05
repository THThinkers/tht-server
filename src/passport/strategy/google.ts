import GoogleStrategy from 'passport-google-oauth';

const { OAuth2Strategy } = GoogleStrategy;
const clientID =
  '246696659137-o84por9sn1qmudb1oiqjpbkfgj8li4u3.apps.googleusercontent.com';
const clientSecret = 'Ufus1zDLQFsBqUhRCDBLpXo-';

const googleStrategy = new OAuth2Strategy(
  {
    clientID,
    clientSecret,
    callbackURL: 'http://localhost:4000/api/auth/redirected',
  },
  function auth(accessToken, refreshToken, profile, done) {
    const { id, emails } = profile;
    const fakeUser = {
      id: id,
      email: emails[0] ? emails[0].value : null,
    };
    return done('', fakeUser);
  },
);

export default googleStrategy;
