import { Request, Response } from "express";
import ReservationServices from "../services/ReservationServices";

export default class ReservationController {
  private reservationServices;

  constructor(reservationServices: ReservationServices) {
    this.reservationServices = reservationServices;
  }

  getReservations = async (req: Request, res: Response) => {
    const { page, limit, q, status } = req.query;

    try {
      const reservations = await this.reservationServices.getReservations({
        page: Number(page),
        limit: Number(limit),
        q: q ? String(q) : "",
        status: String(status),
      });

      res.status(200).json({
        status: "success",
        data: {
          records: reservations.rows,
          metadata: {
            total_records: reservations.count,
            page: Number(page),
            limit: Number(limit),
          },
        },
      });
    } catch (error) {
      throw error;
    }
  };

  getReservationById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const reservation = await this.reservationServices.getReservationById(
        Number(id)
      );

      res.status(200).json({ status: "success", data: { reservation } });
    } catch (error) {
      throw error;
    }
  };

  updateReservation = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
      await this.reservationServices.editReservation(Number(id), {
        status,
      });

      res.status(200).json({
        status: "success",
        message: "Reservation updated successfully",
      });
    } catch (error) {
      throw error;
    }
  };
}
