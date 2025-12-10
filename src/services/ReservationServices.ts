import { FindOptions, ModelStatic, Op, WhereOptions } from "sequelize";
import NotFoundError from "../exceptions/NotFound";
import Reservation from "../models/Reservation";
import Customer from "../models/Customer";

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
  }: {
    page: number;
    limit: number;
    q?: string;
    status: string;
    options?: FindOptions;
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
        include: {
          model: Customer,
          as: "customer",
          attributes: {
            exclude: ["created_at", "updated_at"],
          },
          where: customerWhere,
        },
        where: {
          status,
        },
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
}
