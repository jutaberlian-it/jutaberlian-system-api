import express from "express";
import validate from "../middlewares/validate";
import { isReservationAdmin } from "../middlewares/auth";
import ReservationServices from "../services/ReservationServices";
import ReservationController from "../controllers/ReservationController";
import { UpdateReservationSchema } from "../validator/reservationValidator";

const router = express.Router();

export default (service: ReservationServices) => {
  const controller = new ReservationController(service);

  router.get("/reservations", controller.getReservations);
  router.get(
    "/reservations/dashboard",
    isReservationAdmin,
    controller.getReservationDashboardData
  );
  router.get("/reservations/:id", controller.getReservationById);
  router.put(
    "/reservations/:id",
    isReservationAdmin,
    validate(UpdateReservationSchema),
    controller.updateReservation
  );

  return router;
};
