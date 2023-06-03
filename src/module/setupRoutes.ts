import { Application } from "express";
import { router as v1Router } from "../route/v1";

export function setupRoutes(app: Application) {
  app.use('/v1', v1Router);

  app.use('*', (_, res) => {
    res.status(404).json({
      message: 'It seems you are lost 😉',
      issues: ['Route does not exit']
    })
  });
}
