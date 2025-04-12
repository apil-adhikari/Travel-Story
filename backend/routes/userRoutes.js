import express from 'express';
import { authenticateToken } from '../utils/authenticateToken.js';
import { getUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/me', authenticateToken, getUser);

export default router;
