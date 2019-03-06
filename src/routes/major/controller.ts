import { RequestHandler } from 'express';
import Major from '../../schema/Major';

const getMajorList: RequestHandler = async (req, res, next) => {
  try {
    const majors = await Major.find();
    return res.json({
      majors,
    });
  } catch (err) {
    next(err);
  }
};

export { getMajorList };
