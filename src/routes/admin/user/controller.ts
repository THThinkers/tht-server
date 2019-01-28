import sgMail from '@sendgrid/mail';
import { RequestHandler } from 'express';
import fs from 'fs';
import path from 'path';
import User, { IUser } from '../../../schema/User';

// 이메일 api키 등록
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
const sgHtml = fs.readFileSync(path.join(__dirname, 'email.html'), 'utf-8');

const getUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await User.find({}, 'username name isAdmin isVerified');
    return res.json({
      users,
    });
  } catch (err) {
    err.isOperational = true;
    next(err);
  }
};

const verifyUser: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const user = await User.findByIdAndUpdate(userId, { isVerified: true });
    if (!user) {
      throw new Error('회원을 찾을 수 없습니다.');
    }
    const { username } = user;
    const msg = {
      to: username || 'tmqps78@gmail.com',
      from: 'tht@bjbj.com',
      subject: 'THThinker 회원 인증',
      text: 'THThinker 홈페이지 회원 인증이 완료되었습니다.',
      html: sgHtml,
    };
    sgMail.send(msg);
    res.json({
      success: true,
    });
  } catch (err) {
    err.isOperational = true;
    next(err);
  }
};
export { getUsers, verifyUser };
