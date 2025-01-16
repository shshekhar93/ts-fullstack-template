import express from 'express';
import { userRouter } from './routers/user';

const app = express();
app.use(express.json());
app.use(express.static('../client/public'));
app.use(express.static('../client/dist'));

app.use('/v1/users', userRouter);

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
