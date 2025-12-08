import express from "express";
import validate from "../middlewares/validate";
import ReservationTableServices from "../services/ReservationTableService";
import ReservationTableController from "../controllers/ReservationTableController";
import passport from "../middlewares/passport";
import { isReservationAdmin } from "../middlewares/auth";
import { postReservationTableSchema } from "../validator/reservationTableValidator";

const router = express.Router();

export default (service: ReservationTableServices) => {
  const controller = new ReservationTableController(service);

  router.get("/reservations/tables", controller.getReservationTables);
  router.get("/reservations/tables/:id", controller.getReservationTableById);
  router.post(
    "/reservations/tables",
    passport.authenticate("jwt", { session: false }),
    isReservationAdmin,
    validate(postReservationTableSchema),
    controller.postReservationTable
  );
  router.put(
    "/reservations/tables/:id",
    passport.authenticate("jwt", { session: false }),
    isReservationAdmin,
    validate(postReservationTableSchema),
    controller.updateReservationTable
  );
  router.delete(
    "/reservations/tables/:id",
    passport.authenticate("jwt", { session: false }),
    isReservationAdmin,
    controller.deleteReservationTable
  );

  return router;
};
