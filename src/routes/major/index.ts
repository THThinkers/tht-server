import express from 'express';
import * as controller from './controller';

const router = express.Router();

router.get('/list', controller.getMajorList);

export default router;
