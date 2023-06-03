import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { DomainErrror } from "../utils/error";
import { logger } from "../utils/logger";

export function errorHandler(): ErrorRequestHandler {
  return (err: Error, _req: Request, res: Response, next: NextFunction) => {
    if (err instanceof DomainErrror) {
      res.status(err.statusCode);
      res.json({
        message: err.message,
        issues: err.issues,
      })
    }

    next(err);
  }
}