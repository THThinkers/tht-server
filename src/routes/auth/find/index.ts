import express from 'express';
import * as controller from './controller';

const router = express.Router();

router.post('/username', controller.findUsername);
router.post('/password', controller.findPassword);

export default router;
