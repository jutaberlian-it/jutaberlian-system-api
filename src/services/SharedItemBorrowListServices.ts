import { IncludeOptions, ModelStatic, Op } from "sequelize";
import SharedItemBorrowList from "../models/SharedItemBorrowList";
import NotFoundError from "../exceptions/NotFound";
import ClientError from "../exceptions/ClientError";

export default class SharedItemBorrowListServices {
  private model;

  constructor(model: ModelStatic<SharedItemBorrowList>) {
    this.model = model;
  }

  getLists = async ({ options }: { options?: IncludeOptions } = {}) => {
    try {
      return this.model.findAll({
        attributes: { exclude: ["created_at", "updated_at"] },
        ...options,
      });
    } catch (error) {
      throw error;
    }
  };

  getListsByItemId = async (itemId: number) => {
    try {
      return this.model.findAll({
        where: { shared_item_id: itemId },
        attributes: { exclude: ["created_at", "updated_at"] },
      });
    } catch (error) {
      throw error;
    }
  };

  addList = async (data: {
    shared_item_id: number;
    name: string;
    borrow_start_date: Date;
    borrow_end_date: Date;
  }) => {
    try {
      const borrowList = await this.model.findOne({
        where: {
          shared_item_id: data.shared_item_id,
          /* 
          Find overlaping condition between two date ranges:
          First think about when two date ranges do NOT overlap
          They do not overlap if one ends before the other starts.
          A = existing borrow, B = new borrow
          A_end <= B_start OR B_end <= A_start
          
          Negating this condition gives us the overlapping condition:
          A_end > B_start AND A_start < B_end 
          */
          borrow_start_date: { [Op.lt]: data.borrow_end_date },
          borrow_end_date: { [Op.gt]: data.borrow_start_date },
        },
      });

      if (borrowList) {
        throw new ClientError("Borrow list conflicts with existing entry");
      }

      const newList = await this.model.create(data);
      return newList.id;
    } catch (error) {
      throw error;
    }
  };

  deleteList = async (id: number) => {
    try {
      const list = await this.model.findByPk(id);

      if (!list) {
        throw new NotFoundError("Shared item borrow list not found");
      }

      await list.destroy();
    } catch (error) {
      throw error;
    }
  };
}
