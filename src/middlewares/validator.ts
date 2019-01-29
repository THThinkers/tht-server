import Joi, { JoiObject } from 'joi';
import { IError } from '../types/error';

const validator = (schema: JoiObject, property: string = 'body') => {
  return (req, res, next) => {
    const target = req[property];
    const { error } = Joi.validate(target, schema);
    if (error) {
      (error as IError).isOperational = true;
      next(error);
    }
    next();
  };
};

export default validator;
