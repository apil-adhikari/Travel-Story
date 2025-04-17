import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import userRouter from './routes/userRoutes.js';
import authRouter from './routes/authRoutes.js';
import travelStoryRouter from './routes/travelStoryRoutes.js';

const app = express();

// To parse req.body use need to use express.json() middleware
app.use(express.json());

// Serving static files from 'public' directory

const __filename = fileURLToPath(import.meta.url); //only for esmodule
const __dirname = path.dirname(__filename); //only for esmodule

app.use(express.static(path.join(__dirname, 'public')));

// Mounting Routers using middleware(syntax: app.use() this is a middleware)
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/travelstory', travelStoryRouter);

export default app;
