import express from 'express';
import userRouter from './routes/userRoutes.js';
import authRouter from './routes/authRoutes.js';

const app = express();

// To parse req.body use need to use express.json() middleware
app.use(express.json());

// Mounting Routers using middleware(syntax: app.use()   this is a middleware)
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);

export default app;
