import { FindOptions, ModelStatic, Op, WhereOptions } from "sequelize";
import NotFoundError from "../exceptions/NotFound";
import Reservation from "../models/Reservation";
import Customer from "../models/Customer";
import Table from "../models/Table";

export default class ReservationServices {
  private model;

  constructor(model: ModelStatic<Reservation>) {
    this.model = model;
  }

  getReservations = async ({
    page = 1,
    limit = 10,
    q,
    status = "CONFIRMED",
    options,
    start_date,
    end_date,
  }: {
    page: number;
    limit: number;
    q?: string;
    status: string;
    options?: FindOptions;
    start_date: Date;
    end_date: Date;
  }) => {
    try {
      const customerWhere: WhereOptions = {};

      if (q && q !== "") {
        customerWhere.fullname = {
          [Op.iLike]: `%${q}%`,
        };
      }

      return this.model.findAndCountAll({
        ...options,
        attributes: { exclude: ["created_at", "updated_at"] },
        include: [
          {
            model: Customer,
            as: "customer",
            attributes: {
              exclude: ["created_at", "updated_at"],
            },
            where: customerWhere,
          },
          {
            model: Table,
            as: "tables",
            through: { attributes: [] },
            attributes: ["id", "table_number"],
          },
        ],
        where: {
          status,
          start_datetime: {
            [Op.between]: [start_date, end_date],
          },
        },
        order: [["start_datetime", "ASC"]],
        offset: (page - 1) * limit,
        limit: limit,
      });
    } catch (error) {
      throw error;
    }
  };

  getReservationById = async (id: number, options?: FindOptions) => {
    try {
      const reservation = await this.model.findByPk(id, {
        attributes: { exclude: ["created_at", "updated_at"] },
        ...options,
      });

      if (!reservation) {
        throw new NotFoundError("Reservation not found");
      }

      return reservation;
    } catch (error) {
      console.error("Error retrieving reservation by ID:", error);
      throw error;
    }
  };

  editReservation = async (
    id: number,
    data: {
      status:
        | "PENDING"
        | "CONFIRMED"
        | "SEATED"
        | "COMPLETED"
        | "CANCELLED"
        | "NO_SHOW";
    }
  ) => {
    try {
      const reservation = await this.getReservationById(id);

      await reservation.update(data);
    } catch (error) {
      console.error("Error updating table:", error);
      throw error;
    }
  };

  getReservationDashboardData = async ({
    start_date,
    end_date,
  }: {
    start_date: Date;
    end_date: Date;
  }) => {
    try {
      return await this.model.count({
        where: {
          start_datetime: {
            [Op.between]: [start_date, end_date],
          },
        },
        group: ["status"],
      });
    } catch (error) {
      throw error;
    }
  };
}
