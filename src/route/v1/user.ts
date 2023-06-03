import { Request, Response, Router } from "express";
import { getServices } from "../../module/configureApp";

const router = Router();

async function getUserById(req: Request, res: Response) {
  const { user: userService } = getServices(req.app);

  const user = await userService.getUserById(req.params.id);

  res.status(200).json({
    data: {
      user
    }
  })
}

async function createUser(req: Request, res: Response) {
  const { user: userService } = getServices(req.app);
  const { email } = req.body;

  const user = await userService.createUser(email);

  res.status(201).json({
    data: {
      user
    }
  })
}

router.get('/:id', getUserById);
router.post('/', createUser);

export { router }
