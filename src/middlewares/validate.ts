import { NextFunction, Request, Response } from "express";
import * as z from "zod";
import ClientError from "../exceptions/ClientError";
import { validate } from "../utils/validation";

export default (validator: z.ZodObject | z.ZodArray) =>
  (req: Request, res: Response, next: NextFunction) => {
    const input = req.body;

    if (!input) {
      throw new ClientError("No input data provided", 400);
    }

    try {
      validate(input, validator);
      next();
    } catch (error) {
      throw error;
    }
  };
