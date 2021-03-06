import express from 'express';
import * as controller from './controller';

const router = express.Router();

router.get('/list', controller.getTags);

export default router;
