import { NextFunction, Request, Response } from "express";
import AuthenticationError from "../exceptions/AuthenticationError";
import AuthServices from "../services/AuthServices";
import passport from "passport";

export default class AuthController {
  private service: AuthServices;

  constructor(service: AuthServices) {
    this.service = service;
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    const isValidUser = await this.service.validateUser(username, password);

    if (!isValidUser) {
      throw new AuthenticationError("Authentication failed");
    }

    const token = await this.service.generateToken(username);

    res.status(200).json({ success: true, data: { token } });
  };

  getUserSession = async (req: Request, res: Response, next: NextFunction) => {
    return res.json({
      success: true,
      data: {
        user: req.user,
      },
    });
  };
}
