import express, { NextFunction, Request, Response } from "express";
import AuthController from "../controllers/AuthController";
import AuthServices from "../services/AuthServices";
import passport from "passport";
import { isLoggedIn } from "../middlewares/auth";
import { AuthenticateOptionsGoogle } from "passport-google-oauth20";

const router = express.Router();

export default (service: AuthServices) => {
  const controller = new AuthController(service);

  router.post("/login", controller.login);

  router.get("/google", (req, res, next) => {
    let returnTo = "";
    let opts: AuthenticateOptionsGoogle = {
      scope: ["profile", "email"],
    };

    if (req.query.returnTo) {
      returnTo = req.query.returnTo as string;
      opts = {
        ...opts,
        state: Buffer.from(JSON.stringify({ returnTo })).toString("base64"),
      };
    }

    passport.authenticate("google", opts)(req, res, next);
  });

  router.get(
    "/google/callback",
    (req: Request, res: Response, next: NextFunction) => {
      // default
      let returnTo = "/";
      // decode state safely if present
      const stateParam =
        typeof req.query.state === "string" ? req.query.state : null;

      if (stateParam) {
        try {
          const decoded = JSON.parse(
            Buffer.from(stateParam, "base64").toString("utf8")
          ) as { returnTo?: string };

          // validate the return path to avoid open redirects
          if (decoded.returnTo) {
            returnTo = decoded.returnTo;
          }
        } catch (e) {
          console.warn("Invalid state param:", e);
        }
      }
      passport.authenticate("google", {
        failureRedirect: "/login",
        successRedirect: process.env.APP_HOST + returnTo,
      })(req, res, next);
    }
  );

  router.post("/logout", (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.json({
        success: true,
        message: "Logged out successfully",
      });
    });
  });

  router.get("/user/session", isLoggedIn, controller.getUserSession);

  return router;
};
