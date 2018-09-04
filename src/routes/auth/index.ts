import express from 'express';
import passport from 'passport';

import * as controller from './controller';

const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login'],
  }),
);
// router.get('/kakao', controller.kakaoLogin);
router.get(
  '/redirected',
  passport.authenticate('google', { failureRedirect: '/login' }),
  controller.redirected,
);

export default router;
