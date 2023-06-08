import { Router } from 'express';
import { router as userRouter } from './user';
import { router as authRouter } from './auth';

const router = Router();

router.use('/user', userRouter);
router.use('/', authRouter);

export { router };
