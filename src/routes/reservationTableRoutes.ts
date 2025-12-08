import express from "express";
import validate from "../middlewares/validate";
import ReservationTableServices from "../services/ReservationTableService";
import ReservationTableController from "../controllers/ReservationTableController";
import { isReservationAdmin } from "../middlewares/auth";
import { postReservationTableSchema } from "../validator/reservationTableValidator";

const router = express.Router();

export default (service: ReservationTableServices) => {
  const controller = new ReservationTableController(service);

  router.get("/reservations/tables", controller.getReservationTables);
  router.get("/reservations/tables/:id", controller.getReservationTableById);
  router.post(
    "/reservations/tables",
    isReservationAdmin,
    validate(postReservationTableSchema),
    controller.postReservationTable
  );
  router.put(
    "/reservations/tables/:id",
    isReservationAdmin,
    validate(postReservationTableSchema),
    controller.updateReservationTable
  );
  router.delete(
    "/reservations/tables/:id",
    isReservationAdmin,
    controller.deleteReservationTable
  );

  return router;
};
