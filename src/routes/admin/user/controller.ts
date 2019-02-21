import { RequestHandler } from 'express';
import User, { IUser } from '../../../schema/User';

const getUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await User.find(
      {},
      'username name major studentId isAdmin isVerified',
    );
    return res.json({
      users,
    });
  } catch (err) {
    err.isOperational = true;
    next(err);
  }
};
const getUserProfile: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.query;
    const user = await User.findById(
      userId,
      'username name phoneNumber description major studentId isVerified',
    );
    if (!user) {
      return res.json({
        isExist: false,
      });
    }
    return res.json({
      user,
      isExist: true,
    });
  } catch (err) {
    err.isOperational = true;
    next(err);
  }
};
// toggle이 꼭 필요할까?
const verifyUser: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('회원을 찾을 수 없습니다.');
    }
    user.isVerified = !user.isVerified;
    await user.save();
    const { username } = user;
    if (username && req.sgMail) {
      req.sgMail.send({
        to: username,
        subject: 'THThinker 회원 인증',
        text: 'THThinker 홈페이지 회원 인증이 완료되었습니다.',
      });
    }
    res.json({
      success: true,
    });
  } catch (err) {
    err.isOperational = true;
    next(err);
  }
};
const deleteUser: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndRemove(userId);
    if (user) {
      return res.json({
        success: true,
      });
    }
    return res.json({
      success: false,
    });
  } catch (err) {
    err.isOperational = true;
    next(err);
  }
};
export { getUsers, getUserProfile, verifyUser, deleteUser };
