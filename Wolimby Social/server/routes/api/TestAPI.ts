import express from 'express';
import controller from '../../controllers/TestController';

const router = express.Router();

router.get('/testrequest', controller.test);

export = router;