import express from 'express';
import passport from 'passport';

import validator from '../../../middlewares/validator';
import { addSignupTags } from '../middleware';
import { linkSchema, userSchema } from '../schema';
import * as controller from './controller';

const router = express.Router();

/* /api/auth/oauth/ */

// oauth routing
// api 한번 정리 필요!
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  }),
);

// router.get('/kakao', controller.kakaoLogin);

router.get(
  '/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  controller.callbackGoogle,
);
// Kakao 로그인 테스트
router.get('/kakao', controller.oauthKakao);
router.get('/callback/kakao', controller.callbackKakao);

router.post(
  '/signup',
  validator(userSchema),
  addSignupTags,
  controller.oauthSignup,
);
router.post(
  '/link',
  validator(linkSchema),
  addSignupTags,
  controller.oauthLink,
);

export default router;
