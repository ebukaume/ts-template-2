import { Router } from 'express';
import { router as userRouter } from './user';

const router = Router();

router.use('/user', userRouter);

export { router };
