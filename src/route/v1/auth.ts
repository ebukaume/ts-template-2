import { type Request, type Response, Router } from 'express';
import { getServices } from '../../module/configureApp';
import { ResponseBuilder } from '../../utils/responseBuilder';

const router = Router();

async function registerHandler (req: Request, res: Response): Promise<void> {
  const { auth: authService } = getServices(req.app);

  const user = await authService.register(req.body);

  ResponseBuilder.success(res, 201, { user });
}

async function confirmEmailHandler (req: Request, res: Response): Promise<void> {
  const { auth: authService } = getServices(req.app);
  const { email } = req.body;

  const data = await authService.confirmEmail(email);

  ResponseBuilder.success(res, 200, { user: data });
}

// eslint-disable-next-line
router.post('/register', registerHandler)
// eslint-disable-next-line
router.get('/confirm-email', confirmEmailHandler)

export { router };
