import express, { ErrorRequestHandler } from 'express';
import lowDB from '../../../utils/lowDB';

const router = express.Router();

router.get('/', async (req, res, next) => {
  const { target } = req.query;
  try {
    const imageUrl = await lowDB.db.get(target).value();
    return res.json({
      payload: imageUrl,
    });
  } catch (err) {
    next(err);
  }
});
router.post('/', async (req, res, next) => {
  const { target, imageUrl } = req.body;
  try {
    await lowDB.db.set(target, imageUrl).write();
    return res.json({
      success: true,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
