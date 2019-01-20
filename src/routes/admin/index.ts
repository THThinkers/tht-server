import express from 'express';
import * as adminController from './controller';
import errorHandler from './error';
import userRoute from './user';
const router = express.Router();

router.get('/', (req, res) => res.sendFile(__dirname + '/test.html'));
router.post('/login', adminController.login); // 어드민으로 로그인

router.use('/user', userRoute); // 회원관리 라우터

router.use(errorHandler); // 에러 핸들링

export default router;
