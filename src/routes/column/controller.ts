import { Request, Response } from 'express';
import Column from '../../schema/Column';

interface IColumnRequest {
  author: string;
  nextAuthor: string;
  columnDocument: string;
}

const postColumn = (req: Request, res: Response) => {
  const body: IColumnRequest = req.body;
  return res.json({
    body,
  });
};

const getColumn = (req: Request, res: Response) => {
  const columnID = req.params.column;
  Column.findOne({ docNo: columnID }).then((column) => {
    if (!column) {
      return res.status(404).json({
        message: 'Column Is Not Exists',
      });
    }
  });
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

export { postColumn, getColumn, getColumnList };
