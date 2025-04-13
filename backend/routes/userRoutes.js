import express from 'express';
import { authenticateToken } from '../utils/authenticateToken.js';
import { deleteMe, getMe, updateMe } from '../controllers/userController.js';

const router = express.Router();

router.get('/me', authenticateToken, getMe);
router.patch('/update-me', authenticateToken, updateMe);
router.delete('/delete-me', authenticateToken, deleteMe);

export default router;
