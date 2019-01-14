import express from 'express';
import passport from 'passport';

import * as controller from './controller';
import * as errorHandler from './error';

const router = express.Router();

// oauth routing
// api 한번 정리 필요!
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
router.put('/oauth/profile', controller.putProfile);

// Kakao 로그인 테스트
router.get('/oauth/kakao', controller.oauthKakao);
router.get('/oauth/callback/kakao', controller.callbackKakao);

router.get('/profile', controller.getProfile);
router.get('/logout', controller.logout);

router.use(errorHandler.authErrorHandler);

export default router;
