import express from 'express';
import * as controller from './controller';

const router = express.Router();

router.use('/kakao', controller.kakaoLogin);
router.use('/redirected', controller.redirected);

export default router;
