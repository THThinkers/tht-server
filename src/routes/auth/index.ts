import express from 'express';
import passport from 'passport';

import * as controller from './controller';

const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  }),
);
// router.get('/kakao', controller.kakaoLogin);
router.get(
  '/redirected',
  passport.authenticate('google', { failureRedirect: '/login' }),
  controller.redirected,
);

router.get('/profile', controller.getProfile);
export default router;
