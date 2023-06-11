import { type Request, type Response, Router } from 'express';
import { getServices } from '../../module/configureApp';
import { ResponseBuilder } from '../../utils/responseBuilder';
import { authenticate } from '../../middleware/authenticate';
import { type AuthenticatedRequest } from '../../type';

const router = Router();

async function registerHandler (req: Request, res: Response): Promise<void> {
  const { auth: authService } = getServices(req.app);

  const user = await authService.register(req.body);

  ResponseBuilder.success(res, 201, { user });
}

async function confirmEmailHandler (req: Request, res: Response): Promise<void> {
  const { auth: authService } = getServices(req.app);
  const { email, token } = req.query;

  const data = await authService.confirmEmail(email as string, token as string);

  ResponseBuilder.success(res, 200, { user: data });
}

async function loginHandler (req: Request, res: Response): Promise<void> {
  const { auth: authService } = getServices(req.app);
  const { email, password } = req.body;

  const token = await authService.login(email, password);

  ResponseBuilder.success(res, 200, { token });
}

async function logoutHandler (req: AuthenticatedRequest, res: Response): Promise<void> {
  const { auth: authService } = getServices(req.app);

  await authService.logout(req.user);

  ResponseBuilder.success(res, 200, {});
}

// eslint-disable-next-line
router.post('/register', registerHandler)
// eslint-disable-next-line
router.get('/confirm-registration', confirmEmailHandler)
// eslint-disable-next-line
router.post('/login', loginHandler)
// eslint-disable-next-line
router.delete('/logout', authenticate(), logoutHandler)

export { router };
