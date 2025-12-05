import express from "express";
import validate from "../middlewares/validate";
import { postSharedItemSchema } from "../validator/sharedItemValidator";
import ReservationTableServices from "../services/ReservationTableService";
import ReservationTableController from "../controllers/ReservationTableController";

const router = express.Router();

export default (service: ReservationTableServices) => {
  const controller = new ReservationTableController(service);

  router.get("/reservations/tables", controller.getReservationTables);
  router.get("/reservations/tables/:id", controller.getReservationTableById);
  router.post(
    "/reservations/tables",
    validate(postSharedItemSchema),
    controller.postReservationTable
  );
  router.put("/reservations/tables/:id", controller.updateReservationTable);
  router.delete("/reservations/tables/:id", controller.deleteReservationTable);

  return router;
};
