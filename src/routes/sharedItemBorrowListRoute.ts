import express from "express";
import validate from "../middlewares/validate";
import authenticate from "../middlewares/passport";
import SharedItemBorrowListServices from "../services/SharedItemBorrowListServices";
import SharedItemBorrowListController from "../controllers/SharedItemBorrowListController";
import { postBorrrowListSchema } from "../validator/borrowListValidator";

const router = express.Router();

export default (service: SharedItemBorrowListServices) => {
  const controller = new SharedItemBorrowListController(service);

  router.get("/inventory/borrow-lists", controller.getLists);
  router.post(
    "/inventory/borrow-lists",
    validate(postBorrrowListSchema),
    controller.postList
  );
  router.delete(
    "/inventory/borrow-lists/:id",
    authenticate,
    controller.deleteList
  );

  return router;
};
