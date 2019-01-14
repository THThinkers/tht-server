import { IError } from '../types/error';
import errorHandler from './error';

const handleUncaught = () => {
  process.on('unhandledRejection', (error) => {
    throw error;
  });
  process.on('uncaughtException', async (error: IError) => {
    const isOperational = await errorHandler(error);
    if (!isOperational) {
      process.exit(1);
    }
  });
};

export default handleUncaught;
