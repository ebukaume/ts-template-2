import { type Request, type Response, Router } from 'express';
import { getServices } from '../../module/configureApp';

const router = Router();

async function getUserById (req: Request, res: Response): Promise<void> {
  const { user: userService } = getServices(req.app);

  const user = await userService.getUserById(req.params.id);

  res.status(200).json({
    data: {
      user
    }
  });
}

async function createUser (req: Request, res: Response): Promise<void> {
  const { user: userService } = getServices(req.app);
  const { email } = req.body;

  const user = await userService.createUser(email);

  res.status(201).json({
    data: {
      user
    }
  });
}

// eslint-disable-next-line
router.get('/:id', getUserById)
// eslint-disable-next-line
router.post('/', createUser)

export { router };
