import express from 'express';
import authenticator from '../../middlewares/authenticator';
import * as controller from './controller';

const router = express.Router();

router.get('', authenticator, controller.getColumnList);
router.get('/:column', authenticator, controller.getColumnList);
router.post('/:column', authenticator, controller.postColumn);

export default router;
