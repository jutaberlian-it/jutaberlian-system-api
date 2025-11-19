import { FindOptions, IncludeOptions, ModelStatic } from "sequelize";
import NotFoundError from "../exceptions/NotFound";
import SharedItem from "../models/SharedItem";

export default class SharedItemServices {
  private model;

  constructor(model: ModelStatic<SharedItem>) {
    this.model = model;
  }

  getSharedItems = async ({ options }: { options?: IncludeOptions } = {}) => {
    return this.model.findAll({
      attributes: { exclude: ["created_at", "updated_at"] },
      ...options,
    });
  };

  getSharedItemById = async (id: number, options?: FindOptions) => {
    try {
      const sharedItem = await this.model.findByPk(id, {
        attributes: { exclude: ["created_at", "updated_at"] },
        ...options,
      });

      if (!sharedItem) {
        throw new NotFoundError("Shared item not found");
      }

      return sharedItem;
    } catch (error) {
      console.error("Error retrieving shared item by ID:", error);
      throw error;
    }
  };

  addSharedItem = async (data: { name: string; description?: string }) => {
    try {
      const sharedItem = await this.model.create(data);
      return sharedItem.id;
    } catch (error) {
      console.error("Error adding shared item:", error);
      throw error;
    }
  };

  editSharedItem = async (
    id: number,
    data: {
      name: string;
      description: string;
    }
  ) => {
    try {
      const sharedItem = await this.model.findByPk(id);

      if (!sharedItem) {
        throw new NotFoundError("Shared item not found");
      }

      await sharedItem.update(data);
    } catch (error) {
      console.error("Error updating shared item:", error);
      throw error;
    }
  };

  deleteSharedItem = async (id: number) => {
    try {
      const sharedItem = await this.model.findByPk(id);

      if (!sharedItem) {
        throw new NotFoundError("Shared item not found");
      }

      await sharedItem.destroy();
    } catch (error) {
      console.error("Error deleting shared item:", error);
      throw error;
    }
  };
}
