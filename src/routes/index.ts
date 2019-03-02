import express from 'express';
import admin from './admin';
import auth from './auth';
import column from './column';
import tag from './tag';

const router = express.Router();

router.use('/admin', admin);
router.use('/column', column);
router.use('/auth', auth);
router.use('/tag', tag);

export default router;
