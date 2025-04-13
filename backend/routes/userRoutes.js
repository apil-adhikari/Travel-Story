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
import {
  createUser,
  restrictRouteTo,
  updatePassword,
} from '../controllers/authController.js';

const router = express.Router();

router.get('/me', authenticateToken, getMe);
router.patch('/update-me', authenticateToken, updateMe);
router.patch('/update-my-password', authenticateToken, updatePassword);
router.delete('/delete-me', authenticateToken, deleteMe);

// Admin Routes: Below routes shoudl be only be accessed by admins so we can make use of middleware

// Admins should also be logged in so use need to use the authenticateToken middleware and to access the following routes the role of the user should be admin ie. these routes should be restricted to admin

router.use(authenticateToken, restrictRouteTo('admin'));

router.get('/', getAllUsers);
router.post('/', createUser);
router.get('/:id', getUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
