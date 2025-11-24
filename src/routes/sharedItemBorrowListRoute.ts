import express from "express";
import validate from "../middlewares/validate";
import SharedItemBorrowListServices from "../services/SharedItemBorrowListServices";
import SharedItemBorrowListController from "../controllers/SharedItemBorrowListController";
import { postBorrrowListSchema } from "../validator/borrowListValidator";
import { isLoggedIn } from "../middlewares/auth";
import uploads from "../utils/uploads";
import { upload } from "../config/multer";

const router = express.Router();

export default (service: SharedItemBorrowListServices) => {
  const controller = new SharedItemBorrowListController(service);

  router.get("/inventory/borrow-lists", controller.getLists);
  router.get("/inventory/borrow-lists/me", isLoggedIn, controller.getUserLists);
  router.post(
    "/inventory/borrow-lists",
    isLoggedIn,
    validate(postBorrrowListSchema),
    controller.postList
  );
  router.put(
    "/inventory/borrow-lists/:id",
    isLoggedIn,
    upload.array("photo", 1),
    uploads,
    controller.updateList
  );
  router.delete(
    "/inventory/borrow-lists/:id",
    isLoggedIn,
    controller.deleteList
  );

  return router;
};
