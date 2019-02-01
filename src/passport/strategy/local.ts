import LocalStrategy from 'passport-local';
import User, { IUser } from '../../schema/User';
import { IError } from '../../types/error';

// /api/auth/login - 필요 body : username, password . 필드이름 같아야함.
const localStrategy = new LocalStrategy(
  { session: true },
  async (username, password, done) => {
    const error: IError = new Error();
    try {
      const user = await User.findOne({ username }, '_id username password');
      if (!user) {
        error.message = '잘못된 아이디 혹은 비밀번호.';
        error.isOperational = true;
        throw error;
      }
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        error.message = '잘못된 아이디 혹은 비밀번호.';
        error.isOperational = true;
        throw error;
      }
      done(null, user);
    } catch (err) {
      done(err);
    }
  },
);

export default localStrategy;
