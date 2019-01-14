import { IError } from '../types/error';

const errorHanler = (err: IError) => {
  console.error(err); // 여기서 나중에 버그리포팅 하면 좋을 듯.

  return err.isOperational;
};

export default errorHanler;
