import LocalStrategy from 'passport-local';
import User, { IUser } from '../../schema/User';
import { IError } from '../../types/error';

// /api/auth/login - 필요 body : username, password . 필드이름 같아야함.
const localStrategy = new LocalStrategy(
  { session: true },
  async (username, password, done) => {
    const error: IError = new Error();
    try {
      const user = await User.findOne({ username });
      if (!user) {
        error.message = '잘못된 아이디 혹은 비밀번호 입니다.';
        error.isOperational = true;
        throw error;
      }
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        error.message = '잘못된 아이디 혹은 비밀번호 입니다.';
        error.isOperational = true;
        throw error;
      }
      // if (!user.isVerified) {
      //   error.message =
      //     '회원가입 승인이 안 되어 있어요. 학회장한테 문의하세요.';
      //   error.isOperational = true;
      //   throw error;
      // }
      const sensitiveUser = Object.assign(user, {
        password: undefined,
      });
      done(null, sensitiveUser);
    } catch (err) {
      done(err);
    }
  },
);

export default localStrategy;
