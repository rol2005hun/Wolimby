import express from 'express';
import controller from '../../controllers/UrlController';
import { checkUrl } from '../../middlewares/UrlMiddleware';

const router = express.Router();

router.get('/get', controller.url);
router.post('/create', checkUrl, controller.create);

export = router;
