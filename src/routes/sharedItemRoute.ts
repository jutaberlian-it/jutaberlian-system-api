import express from "express";
import SharedItemServices from "../services/SharedItemServices";
import SharedItemController from "../controllers/SharedItemController";
import validate from "../middlewares/validate";
import { postSharedItemSchema } from "../validator/sharedItemValidator";
import { authenticateJwt } from "../middlewares/passport";

const router = express.Router();

export default (service: SharedItemServices) => {
  const controller = new SharedItemController(service);

  router.get("/inventory/shared-items", controller.getSharedItems);
  router.get("/inventory/shared-items/:id", controller.getSharedItemById);
  router.post(
    "/inventory/shared-items",
    authenticateJwt,
    validate(postSharedItemSchema),
    controller.postSharedItem
  );
  router.put(
    "/inventory/shared-items/:id",
    authenticateJwt,
    controller.updateSharedItem
  );
  router.delete(
    "/inventory/shared-items/:id",
    authenticateJwt,
    controller.deleteSharedItem
  );

  return router;
};
