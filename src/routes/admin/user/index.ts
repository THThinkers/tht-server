import express from 'express';
import checkAdmin from '../middlewares/checkAdmin';
import * as userController from './controller';
const router = express.Router();

router.get('/list', checkAdmin, userController.getUsers);
router.put('/verify', checkAdmin, userController.verifyUser);

export default router;
