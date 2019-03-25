import { RequestHandler } from 'express';
import lowDB from '../../utils/lowDB';

const getImageUrls: RequestHandler = async (req, res, next) => {
  const { target } = req.query;
  try {
    const imageUrl = target
      ? await lowDB.db.get(target)
      : await lowDB.db.getState();
    return res.json({
      imageUrl,
    });
  } catch (err) {
    next(err);
  }
};

export { getImageUrls };
