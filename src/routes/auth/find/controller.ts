import { RequestHandler } from 'express';
import User from '../../../schema/User';
const findUsername: RequestHandler = (req, res, next) => {
  // 유저네임 찾기
  return res.json({
    username: '',
  });
};

const findPassword: RequestHandler = async (req, res, next) => {
  const { username } = req.body;
  try {
    const user = await User.findOne({}, 'username');
    if (!user || !user.username) {
      return res.json({
        isExist: false,
      });
    }
    const newPassword = '1111'; // 해쉬값으로 수정
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

export { findPassword };
