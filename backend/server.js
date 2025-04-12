import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });
import mongoose from 'mongoose';

import app from './app.js';

// Database connection
const databaseConnectionString = process.env.DATABASE_URL.replace(
  '<PASSWORD_PLACEHOLDER>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(databaseConnectionString)
  .then(() => {
    console.log('Database connection successful 😀');
  })
  .catch((err) => console.log(err));

// Server Creation
const port = process.env.PORT || 8001;
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port} 😀`);
});
