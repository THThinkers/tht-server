import { RequestHandler } from 'express';
import Tag from '../../schema/Tag';

const getTags: RequestHandler = async (req, res, next) => {
  try {
    const { name } = req.query;
    const query = {
      ...(name ? { name: { $regex: name } } : {}),
    };
    const tags = await Tag.find(query);
    return res.json({
      tags,
    });
  } catch (err) {
    next(err);
  }
};

export { getTags };
