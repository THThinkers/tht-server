import express from 'express';
import * as controller from './controller';

const router = express.Router();

/* /api/auth/validation/ */

router.post('/username', controller.validateUsername);

export default router;
