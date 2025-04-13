import express from 'express';
import { authenticateToken } from '../utils/authenticateToken.js';
import {
  deleteMe,
  deleteUser,
  getAllUsers,
  getMe,
  getUser,
  updateMe,
  updateUser,
} from '../controllers/userController.js';
import { createUser, updatePassword } from '../controllers/authController.js';

const router = express.Router();

router.get('/me', authenticateToken, getMe);
router.patch('/update-me', authenticateToken, updateMe);
router.patch('/update-my-password', authenticateToken, updatePassword);
router.delete('/delete-me', authenticateToken, deleteMe);

// Admin Routes: Below routes shoudl be only be accessed by admins so we can make use of middleware
router.get('/', getAllUsers);
router.post('/', createUser);
router.get('/:id', getUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
