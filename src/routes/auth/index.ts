import express from 'express';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from './swagger.json';

import * as controller from './controller';
import * as errorHandler from './error';

const router = express.Router();

// Swagger 설정.
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDoc));
// oauth routing
// api 한번 정리 필요!
router.get(
  '/oauth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  }),
);

// router.get('/kakao', controller.kakaoLogin);

router.get(
  '/oauth/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  controller.callback,
);
router.post('/oauth/signup', controller.oauthSignup);

// Kakao 로그인 테스트
router.get('/oauth/kakao', controller.oauthKakao);
router.get('/oauth/callback/kakao', controller.callbackKakao);

router.post('/login', passport.authenticate('local'), controller.login);
router.post('/signup', controller.signup);
router.get('/profile', controller.getProfile);
router.get('/logout', controller.logout);

router.use(errorHandler.authErrorHandler);

export default router;
