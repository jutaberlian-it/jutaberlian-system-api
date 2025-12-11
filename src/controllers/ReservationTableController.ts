import { Request, Response } from "express";
import ReservationTableServices from "../services/ReservationTableService";

export default class ReservationTableController {
  private reservationTableServices;

  constructor(reservationTableServices: ReservationTableServices) {
    this.reservationTableServices = reservationTableServices;
  }

  getReservationTables = async (req: Request, res: Response) => {
    const { page, limit, q, is_active } = req.query;

    try {
      const tables = await this.reservationTableServices.getReservationTables({
        page: Number(page),
        limit: Number(limit),
        q: q ? String(q) : "",
        is_active: is_active === "true",
      });

      res.status(200).json({
        status: "success",
        data: {
          records: tables.rows,
          metadata: {
            total_records: tables.count,
            page: Number(page),
            limit: Number(limit),
          },
        },
      });
    } catch (error) {
      throw error;
    }
  };

  getReservationTableById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const table = await this.reservationTableServices.getReservationTableById(
        Number(id)
      );

      res.status(200).json({ status: "success", data: { table } });
    } catch (error) {
      throw error;
    }
  };

  postReservationTable = async (req: Request, res: Response) => {
    const { seats, table_number } = req.body;

    try {
      const id = await this.reservationTableServices.addReservationTable({
        seats,
        table_number,
      });

      res.status(201).json({ status: "success", data: { id } });
    } catch (error) {
      throw error;
    }
  };

  updateReservationTable = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { seats, table_number, is_active } = req.body;

    try {
      await this.reservationTableServices.editReservationTable(Number(id), {
        seats,
        table_number,
        is_active,
      });

      res.status(200).json({
        status: "success",
        message: "Table updated successfully",
      });
    } catch (error) {
      throw error;
    }
  };

  deleteReservationTable = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      await this.reservationTableServices.deleteReservationTable(Number(id));

      res.status(200).json({
        status: "success",
        message: "Table deleted successfully",
      });
    } catch (error) {
      throw error;
    }
  };
}
