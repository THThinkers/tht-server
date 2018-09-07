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
  '/oauth/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  controller.callback,
);

router.get('/profile', controller.getProfile);
router.get('/logout', controller.logout);

export default router;
