import express from 'express';
import passport from 'passport';

import * as controller from './controller';

const router = express.Router();

router.get(
  '/oauth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  }),
);
router.put('/oauth/profile', controller.putProfile);
// router.get('/kakao', controller.kakaoLogin);
router.get(
  '/redirected',
  passport.authenticate('google', { failureRedirect: '/login' }),
  controller.redirected,
);

router.get('/profile', controller.getProfile);
router.get('/logout', controller.logout);

export default router;
