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

export const isReservationAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    const user = req.user;

    if (user.role_id === 2) {
      // role_id 2 is Reservation Admin
      return next();
    }
  }

  throw new AuthenticationError("Unauthorized user");
};
