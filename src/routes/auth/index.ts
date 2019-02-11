import express from 'express';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from './swagger.json';

import oauthRoute from './oauth';
import validationRoute from './validation';

import validator from '../../middlewares/validator';
import * as controller from './controller';
import * as errorHandler from './error';
import { userSchema } from './schema';

const router = express.Router();

/* /api/auth/ */
// Swagger 설정.
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDoc));

// child 라우트 정리
router.use('/validation', validationRoute);
router.use('/oauth', oauthRoute);
// oauth routing
// api 한번 정리 필요!

router.post(
  '/login',
  validator(userSchema),
  passport.authenticate('local'),
  controller.login,
);
router.post('/signup', validator(userSchema), controller.signup);
router.get('/profile', controller.getProfile);
router.get('/logout', controller.logout);

router.use(errorHandler.authErrorHandler);

export default router;
