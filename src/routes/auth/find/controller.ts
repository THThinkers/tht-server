import { RequestHandler } from 'express';
import User from '../../../schema/User';
import { generateHash } from '../../../utils/crypt';

const findUsername: RequestHandler = async (req, res, next) => {
  const { name, phoneNumber } = req.body;
  try {
    const user = await User.findOne({ name, phoneNumber }, 'username');
    if (!user) {
      return res.json({
        isExist: false,
      });
    }
    const at = user.username.indexOf('@');

    const hashed = user.username.replace(/[a-z0-9]/gi, (char, i) => {
      return i === 1 || i === at - 2 ? '*' : char;
    });
    // const hashed = user.username.replace(/[a-z]/gi, (char) => {
    //   if (Math.random() > 0.5) {
    //     return '*';
    //   }
    //   return char;
    // });
    return res.json({
      username: hashed,
    });
  } catch (err) {
    err.isOperational = true;
  }
};

const findPassword: RequestHandler = async (req, res, next) => {
  const { username, name, phoneNumber } = req.body;
  try {
    const user = await User.findOne(
      { username, name, phoneNumber },
      'username',
    );
    if (!user) {
      return res.json({
        isExist: false,
      });
    }
    const newPassword = await generateHash(
      Math.random()
        .toString(36)
        .slice(-8),
    );
    await user.update({ password: newPassword });
    if (req.sgMail) {
      req.sgMail.send({
        to: user.username,
        subject: 'password 찾기',
        text: `
          패스워드 분실 안내 메일입니다.
          새로 발급된 패스워드는 ${newPassword} 입니다.
        `,
      });
    }
    return res.json({
      isExist: true,
    });
  } catch (err) {
    next(err);
  }
};

export { findUsername, findPassword };
