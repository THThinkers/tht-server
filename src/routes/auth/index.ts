import express from 'express';
import passport from 'passport';

import findRoute from './find';
import oauthRoute from './oauth';
import validationRoute from './validation';

import validator from '../../middlewares/validator';
import * as controller from './controller';
import * as errorHandler from './error';
import { addSignupTags } from './middleware';
import { signinSchema, userSchema } from './schema';

const router = express.Router();

// child 라우트 정리
router.use('/validation', validationRoute);
router.use('/find', findRoute);
router.use('/oauth', oauthRoute);

router.post(
  '/login',
  validator(signinSchema),
  passport.authenticate('local'),
  controller.login,
);
router.post('/signup', validator(userSchema), addSignupTags, controller.signup);
router.get('/profile', controller.getProfile);
router.get('/logout', controller.logout);

router.use(errorHandler.authErrorHandler);

export default router;
