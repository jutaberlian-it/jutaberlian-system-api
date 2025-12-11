import { FindOptions, ModelStatic, Op, WhereOptions } from "sequelize";
import NotFoundError from "../exceptions/NotFound";
import Table from "../models/Table";

export default class ReservationTableServices {
  private model;

  constructor(model: ModelStatic<Table>) {
    this.model = model;
  }

  getReservationTables = async ({
    page = 1,
    limit = 10,
    q,
    is_active,
    options,
  }: {
    page: number;
    limit: number;
    q?: string;
    is_active: boolean;
    options?: FindOptions;
  }) => {
    const where: WhereOptions = {
      is_active,
    };

    if (q && q !== "") {
      where.table_number = {
        [Op.iLike]: `%${q}%`,
      };
    }

    return this.model.findAndCountAll({
      ...options,
      where,
      attributes: { exclude: ["created_at", "updated_at"] },
      offset: (page - 1) * limit,
      limit: limit,
    });
  };

  getReservationTableById = async (id: number, options?: FindOptions) => {
    try {
      const table = await this.model.findByPk(id, {
        attributes: { exclude: ["created_at", "updated_at"] },
        ...options,
      });

      if (!table) {
        throw new NotFoundError("Table not found");
      }

      return table;
    } catch (error) {
      console.error("Error retrieving table by ID:", error);
      throw error;
    }
  };

  addReservationTable = async (data: {
    seats: number;
    table_number: string;
  }) => {
    try {
      const table = await this.model.create(data);
      return table.id;
    } catch (error) {
      console.error("Error adding new table:", error);
      throw error;
    }
  };

  editReservationTable = async (
    id: number,
    data: { seats: number; table_number: string; is_active: boolean }
  ) => {
    try {
      const table = await this.getReservationTableById(id);

      if (!table) {
        throw new NotFoundError("Table not found");
      }

      await table.update(data);
    } catch (error) {
      console.error("Error updating table:", error);
      throw error;
    }
  };

  deleteReservationTable = async (id: number) => {
    try {
      const table = await this.getReservationTableById(id);

      if (!table) {
        throw new NotFoundError("Table not found");
      }

      await table.destroy();
    } catch (error) {
      console.error("Error deleting table:", error);
      throw error;
    }
  };
}
