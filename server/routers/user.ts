import { Router } from 'express';

export const userRouter = Router();

userRouter.get('/', (req, res) => {
  res.json([{
    id: 1,
  }, {
    id: 2,
  }]);
});

userRouter.post('/', (req, res) => {
  res.status(201).send('Done');
});
