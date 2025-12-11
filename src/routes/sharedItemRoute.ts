import express from "express";
import SharedItemServices from "../services/SharedItemServices";
import SharedItemController from "../controllers/SharedItemController";
import validate from "../middlewares/validate";
import { postSharedItemSchema } from "../validator/sharedItemValidator";
import passport from "../middlewares/passport";

const router = express.Router();

export default (service: SharedItemServices) => {
  const controller = new SharedItemController(service);

  router.get("/inventory/shared-items", controller.getSharedItems);
  router.get("/inventory/shared-items/:id", controller.getSharedItemById);
  router.post(
    "/inventory/shared-items",
    passport.authenticate("jwt", { session: false }),
    validate(postSharedItemSchema),
    controller.postSharedItem
  );
  router.put(
    "/inventory/shared-items/:id",
    passport.authenticate("jwt", { session: false }),
    controller.updateSharedItem
  );
  router.delete(
    "/inventory/shared-items/:id",
    passport.authenticate("jwt", { session: false }),
    controller.deleteSharedItem
  );

  return router;
};
