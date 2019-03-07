import express from 'express';
import admin from './admin';
import auth from './auth';
import column from './column';
import major from './major';
import tag from './tag';

import swaggerUi from 'swagger-ui-express';
import swaggerDoc from './swaggers/index.json';

const router = express.Router();

// Swagger 설정.
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDoc));

router.use('/admin', admin);
router.use('/column', column);
router.use('/auth', auth);
router.use('/major', major);
router.use('/tag', tag);

export default router;
