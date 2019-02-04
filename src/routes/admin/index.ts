import express from 'express';
import * as controller from './controller';
import errorHandler from './error';
import checkAdmin from './middlewares/checkAdmin';
import userRoute from './user';

const router = express.Router();

router.get('/', async (req, res, next) => {
  // admin page 테스트용
  const checkLogin = (err) => {
    if (err) {
      return res.sendFile(__dirname + '/test.html');
    }
    return res.sendFile(__dirname + '/home.html');
  };
  try {
    await checkAdmin(req, res, (err) => checkLogin(err));
  } catch (err) {
    next(err);
  }
});
router.post('/login', controller.login); // 어드민으로 로그인

// 아래 라우트는 전부 admin 체크 후 진행
router.use(checkAdmin);

router.use('/user', userRoute); // 회원관리 라우터

router.use(errorHandler); // 에러 핸들링

export default router;
