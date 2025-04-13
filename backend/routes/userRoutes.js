import express from 'express';
import { authenticateToken } from '../utils/authenticateToken.js';
import { getMe } from '../controllers/userController.js';
import { updateMe } from '../controllers/userController.js';

const router = express.Router();

router.get('/me', authenticateToken, getMe);
router.patch('/update-me', authenticateToken, updateMe);

export default router;
