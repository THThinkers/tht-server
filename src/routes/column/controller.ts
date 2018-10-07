import { Request, Response } from 'express';
import Column from '../../schema/Column';

const getColumn = (req: Request, res: Response) => {
  const columnID = req.params.column;
  return res.json({
    message: 'hi',
    id: columnID,
  });
};

const getColumnList = (req: Request, res: Response) => {
  return res.json({
    message: 'hi',
  });
};

export { getColumn, getColumnList };
