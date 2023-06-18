import { type Request, type Response, Router } from 'express';
import { ResponseBuilder } from '../../utils/responseBuilder';
import { Dependency } from '../../module/dependency';

const router = Router();

async function getUserById (req: Request, res: Response): Promise<void> {
  const { user: userService } = Dependency.service;

  const user = await userService.getById(req.params.id);

  ResponseBuilder.success(res, 200, { user });
}

async function createUser (req: Request, res: Response): Promise<void> {
  ResponseBuilder.success(res, 201, {});
}

// eslint-disable-next-line
router.get('/:id', getUserById)
// eslint-disable-next-line
router.post('/', createUser)

export { router };
