import { FindOptions, ModelStatic } from "sequelize";
import NotFoundError from "../exceptions/NotFound";
import Table from "../models/Table";

export default class ReservationTableServices {
  private model;

  constructor(model: ModelStatic<Table>) {
    this.model = model;
  }

  getReservationTables = async ({
    options,
  }: { options?: FindOptions } = {}) => {
    return this.model.findAndCountAll({
      attributes: { exclude: ["created_at", "updated_at"] },
      ...options,
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

  addReservationTable = async (data: { seats: number }) => {
    try {
      const table = await this.model.create(data);
      return table.id;
    } catch (error) {
      console.error("Error adding new table:", error);
      throw error;
    }
  };

  editReservationTable = async (id: number, data: { seats: number }) => {
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
