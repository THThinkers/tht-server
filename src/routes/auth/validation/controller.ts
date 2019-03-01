import { RequestHandler } from 'express';
import User from '../../../schema/User';

const validateUsername: RequestHandler = async (req, res, next) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });
    res.json({
      isExist: user ? true : false,
    });
  } catch (err) {
    next(err);
  }
};

export { validateUsername };
