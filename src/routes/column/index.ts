import express from 'express';
import authMiddelware from '../../middlewares/authMiddleware';
import * as controller from './controller';

const router = express.Router();

router.get('', authMiddelware, controller.getColumnList);
router.get('/:column', authMiddelware, controller.getColumnList);

export default router;
