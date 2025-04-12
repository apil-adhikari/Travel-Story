import express from 'express';
import userRouter from './routes/userRoutes.js';

const app = express();

// Mounting Routers using middleware(syntax: app.use()   this is a middleware)
app.use('/api/v1/users', userRouter);

export default app;
