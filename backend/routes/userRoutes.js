import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
  res.send('hello from the server. ');
});

export default router;
