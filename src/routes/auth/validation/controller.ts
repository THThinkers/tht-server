import { RequestHandler } from 'express';
import User from '../../../schema/User';

const validateUsername: RequestHandler = async (req, res, next) => {
  try {
    const { username } = req.body;
    const user = User.findOne({ username });
    const isExist = user ? true : false;
    res.json({
      isExist,
    });
  } catch (err) {
    next(err);
  }
};

export { validateUsername };
