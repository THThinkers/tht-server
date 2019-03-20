import express from 'express';
import * as memberController from './controller';
import { memberErrorHandler } from './error';

const router = express.Router();

router.get('/list', memberController.getMemberList);

router.use(memberErrorHandler);

export default router;
