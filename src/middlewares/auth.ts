import { NextFunction, Request, Response } from "express";
import AuthenticationError from "../exceptions/AuthenticationError";

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  throw new AuthenticationError(
    "Unauthenticated user. Please log in to continue"
  );
};
