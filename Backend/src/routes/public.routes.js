import express from 'express';
const router = express.Router();
import * as publicController from '../controllers/public.controller.js';

router.get('/status/:orgSlug', publicController.getPublicStatus);

export default router;
