import express from "express";
import validate from "../middlewares/validate";
import SharedItemBorrowListServices from "../services/SharedItemBorrowListServices";
import SharedItemBorrowListController from "../controllers/SharedItemBorrowListController";
import { postBorrrowListSchema } from "../validator/borrowListValidator";
import { authenticateJwt } from "../middlewares/passport";
import { ensureLoggedIn } from "connect-ensure-login";

const ensureIsLoggedIn = ensureLoggedIn("/login");

const router = express.Router();

export default (service: SharedItemBorrowListServices) => {
  const controller = new SharedItemBorrowListController(service);

  router.get("/inventory/borrow-lists", ensureIsLoggedIn, controller.getLists);
  router.post(
    "/inventory/borrow-lists",
    validate(postBorrrowListSchema),
    controller.postList
  );
  router.delete(
    "/inventory/borrow-lists/:id",
    authenticateJwt,
    controller.deleteList
  );

  return router;
};
