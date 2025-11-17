import express from "express";
import AuthController from "../controllers/AuthController";
import AuthServices from "../services/AuthServices";

const router = express.Router();

export default (service: AuthServices) => {
  const controller = new AuthController(service);

  router.post("/login", controller.login);

  return router;
};
