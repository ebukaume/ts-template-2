import { type Request, type Response, Router } from 'express';
import { getServices } from '../../module/configureApp';
import { ResponseBuilder } from '../../utils/responseBuilder';

const router = Router();

async function getUserById (req: Request, res: Response): Promise<void> {
  const { user: userService } = getServices(req.app);

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
