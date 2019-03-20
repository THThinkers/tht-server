import { RequestHandler } from 'express';
import User, { IUser } from '../../schema/User';

const parseQuery = {
  boolean: (query: string | undefined) =>
    query === 'true' ? true : query === 'false' ? false : undefined,
  number: (query: string | undefined) =>
    query ? parseInt(query, 10) : undefined,
};

const getInteger = (query: string | undefined, base: number) =>
  query ? parseInt(query, 10) : base;

const getMemberList: RequestHandler = async (req, res, next) => {
  const { limit, offset, search, isActive } = req.query;
  try {
    const query = {
      isActive: parseQuery.boolean(isActive),
      ...(search ? { name: search } : {}),
    };
    const projection = '_id name major profilePicture studentId isActive';
    const limitQuery = getInteger(limit, 10);
    const offsetQuery = getInteger(offset, 0);
    const members = await User.find(query, projection)
      .limit(limitQuery)
      .skip(offsetQuery)
      .sort({ name: -1 });
    return res.json({
      payload: members,
    });
  } catch (err) {
    next(err);
  }
};

export { getMemberList };
