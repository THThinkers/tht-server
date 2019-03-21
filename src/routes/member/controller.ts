import { RequestHandler } from 'express';
import User, { IUser } from '../../schema/User';

const parseQuery = {
  boolean: (query: string | undefined) =>
    query === 'true' ? true : query === 'false' ? false : undefined,
  number: (query: string | undefined) =>
    query ? parseInt(query, 10) : undefined,
};

const getMemberList: RequestHandler = async (req, res, next) => {
  const { limit, offset, search, isActive } = req.query;
  try {
    const query = {
      isActive: parseQuery.boolean(isActive),
      ...(search ? { name: search } : {}),
    };
    Object.keys(query).forEach((field) =>
      query[field] === undefined ? delete query[field] : null,
    );
    const projection = '_id name major profilePicture studentId isActive';
    const limitQuery = parseQuery.number(limit);
    const offsetQuery = parseQuery.number(offset);
    const execution = User.find(query, projection).populate('major');
    if (limitQuery) {
      execution.limit(limitQuery);
    }
    if (offsetQuery) {
      execution.skip(offsetQuery);
    }
    const members = await execution.exec();
    return res.json({
      payload: members,
    });
  } catch (err) {
    next(err);
  }
};

export { getMemberList };
