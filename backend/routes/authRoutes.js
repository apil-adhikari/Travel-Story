import express from 'express';
import { signup } from '../controllers/authController.js';

const router = express.Router();

// signup, login, logout
router.post('/signup', signup);
// router.post('/login', login);
// router.post('/logout', logout);

export default router;
