import express from 'express';
import admin from './admin';
import auth from './auth';
import column from './column';

const route = express.Router();

route.use('/admin', admin);
route.use('/column', column);
route.use('/auth', auth);
// oauth도 나눌까 ..

export default route;
