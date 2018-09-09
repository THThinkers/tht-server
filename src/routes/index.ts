import express from 'express';
import auth from './auth';

const route = express.Router();

route.use('/auth', auth);
// oauth도 나눌까 ..

export default route;
