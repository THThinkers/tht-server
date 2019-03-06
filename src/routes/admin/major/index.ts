import express from 'express';
import * as controller from './controller';

const router = express.Router();

router.get('/list', controller.getMajorList);
router.post('/', controller.addMajor);
router.put('/', controller.updateMajor);
router.delete('/', controller.deleteMajor);

export default router;
