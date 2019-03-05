import express from 'express';
import * as userController from './controller';
const router = express.Router();

router.get('/list', userController.getUsers);
router.get('/profile', userController.getUserProfile);
router.put('/update', userController.updateUser);
router.put('/verify', userController.verifyUser);
router.delete('/delete/:userId', userController.deleteUser);
export default router;
